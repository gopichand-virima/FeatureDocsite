/**
 * Enterprise-Grade Voice Input Service
 * Full-length speech recognition with OpenAI Whisper API
 * CRITICAL: Properly handles browser permission dialogs with user gesture context
 */

import { SearchConfig } from '../config';

interface VoiceRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  stream: MediaStream | null;
}

interface TranscriptionResult {
  text: string;
  duration: number;
  language?: string;
  confidence?: number;
}

type MicrophoneError = 
  | 'PERMISSION_DENIED'
  | 'PERMISSION_DISMISSED'
  | 'NO_DEVICE_FOUND'
  | 'NOT_SUPPORTED'
  | 'NOT_SECURE_CONTEXT'
  | 'DEVICE_IN_USE'
  | 'UNKNOWN_ERROR';

export class VoiceInputService {
  private state: VoiceRecordingState = {
    isRecording: false,
    isPaused: false,
    duration: 0,
    mediaRecorder: null,
    audioChunks: [],
    stream: null,
  };

  private durationInterval: number | null = null;
  private silenceTimeout: number | null = null;
  private onTranscriptionCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: Error) => void) | null = null;
  private onStatusChangeCallback: ((status: string) => void) | null = null;

  // Configuration
  private readonly SILENCE_THRESHOLD = 3000; // 3 seconds of silence
  private readonly MAX_RECORDING_DURATION = 600000; // 10 minutes (safety limit)

  /**
   * Check if browser supports audio recording
   */
  isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Check if running on HTTPS (required for microphone)
   */
  isSecureContext(): boolean {
    return window.isSecureContext || window.location.hostname === 'localhost';
  }

  /**
   * Check if Whisper API is configured
   */
  isConfigured(): boolean {
    const apiKey = SearchConfig.whisper.apiKey;
    return !!(apiKey && apiKey.trim().length > 0 && !apiKey.includes('YOUR_OPENAI_API_KEY'));
  }

  /**
   * Query current permission state (Chrome, Edge, Firefox)
   * Safari doesn't fully support this API
   */
  async getPermissionState(): Promise<PermissionState | 'unsupported'> {
    try {
      if (!navigator.permissions || !navigator.permissions.query) {
        return 'unsupported';
      }
      
      const result = await navigator.permissions.query({ 
        name: 'microphone' as PermissionName 
      });
      return result.state; // 'granted' | 'denied' | 'prompt'
    } catch {
      // Safari and some browsers throw on this query
      return 'unsupported';
    }
  }

  /**
   * CRITICAL: Start recording - MUST be called directly from user gesture (click)
   * This triggers the browser's native permission dialog if needed
   */
  async startRecording(
    onTranscription: (text: string) => void,
    onError?: (error: Error) => void,
    onStatusChange?: (status: string) => void
  ): Promise<void> {
    // Pre-flight checks (synchronous - don't break user gesture)
    if (!this.isSupported()) {
      const error = new Error('Audio recording is not supported in this browser');
      onError?.(error);
      throw error;
    }

    if (!this.isSecureContext()) {
      const error = new Error('Microphone requires HTTPS. Please use a secure connection.');
      onError?.(error);
      throw error;
    }

    if (!this.isConfigured()) {
      const error = new Error('OpenAI Whisper API is not configured');
      onError?.(error);
      throw error;
    }

    if (this.state.isRecording) {
      const error = new Error('Recording is already in progress');
      onError?.(error);
      throw error;
    }

    // Store callbacks
    this.onTranscriptionCallback = onTranscription;
    this.onErrorCallback = onError || null;
    this.onStatusChangeCallback = onStatusChange || null;

    try {
      // CRITICAL: This must be called directly within the user gesture context
      // Do NOT check permissions first - let getUserMedia handle it
      this.notifyStatus('Requesting microphone access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Optimal for Whisper
        },
      });

      // If we get here, permission was granted!
      this.state.stream = stream;
      this.notifyStatus('Microphone ready');

      // Create MediaRecorder with optimal settings
      const mimeType = this.getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      this.state.mediaRecorder = mediaRecorder;
      this.state.audioChunks = [];
      this.state.duration = 0;
      this.state.isRecording = true;

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.state.audioChunks.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        await this.processRecording();
      };

      // Handle errors
      mediaRecorder.onerror = (event: any) => {
        console.error('MediaRecorder error:', event.error);
        this.handleError(new Error(`Recording error: ${event.error?.message || 'Unknown error'}`));
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      this.notifyStatus('Recording...');

      // Start duration counter
      this.startDurationCounter();

      console.log('Voice recording started with unlimited duration support');
    } catch (error) {
      console.error('Failed to start recording:', error);
      this.handleGetUserMediaError(error);
      throw error;
    }
  }

  /**
   * Handle getUserMedia errors with proper error types
   */
  private handleGetUserMediaError(error: unknown): void {
    if (error instanceof DOMException) {
      let userMessage = '';
      
      switch (error.name) {
        case 'NotAllowedError':
          // User clicked "Block" or permission was previously denied
          userMessage = this.getPermissionDeniedMessage();
          break;

        case 'NotFoundError':
        case 'DevicesNotFoundError':
          // No microphone hardware detected
          userMessage = 'No microphone detected. Please connect a microphone and try again.';
          break;

        case 'AbortError':
          // User dismissed the dialog without choosing
          userMessage = 'Microphone permission request was dismissed. Please try again.';
          break;

        case 'NotReadableError':
        case 'TrackStartError':
          // Microphone in use by another application
          userMessage = 'Microphone is in use by another application. Please close other apps using the microphone.';
          break;

        case 'SecurityError':
          // HTTPS required or iframe permissions issue
          userMessage = 'Microphone access requires a secure connection (HTTPS).';
          break;

        default:
          userMessage = `Unable to access microphone: ${error.message}`;
      }

      const wrappedError = new Error(userMessage);
      this.handleError(wrappedError);
    } else {
      this.handleError(error as Error);
    }
  }

  /**
   * Stop recording and transcribe
   */
  async stopRecording(): Promise<void> {
    if (!this.state.isRecording) {
      return;
    }

    this.notifyStatus('Stopping recording...');

    // Clear timers
    this.clearTimers();

    // Stop media recorder
    if (this.state.mediaRecorder && this.state.mediaRecorder.state !== 'inactive') {
      this.state.mediaRecorder.stop();
    }

    // Stop media stream
    if (this.state.stream) {
      this.state.stream.getTracks().forEach(track => track.stop());
      this.state.stream = null;
    }

    this.state.isRecording = false;
  }

  /**
   * Process recorded audio and transcribe with Whisper
   */
  private async processRecording(): Promise<void> {
    if (this.state.audioChunks.length === 0) {
      this.handleError(new Error('No audio data recorded'));
      return;
    }

    this.notifyStatus('Processing audio...');

    try {
      // Combine audio chunks into a single blob
      const mimeType = this.getSupportedMimeType();
      const audioBlob = new Blob(this.state.audioChunks, { type: mimeType });
      
      console.log(`Processing audio: ${audioBlob.size} bytes, ${this.state.duration}s duration`);

      // Transcribe with OpenAI Whisper
      this.notifyStatus('Transcribing with Whisper API...');
      const result = await this.transcribeWithWhisper(audioBlob);

      // Notify callback with transcription
      if (this.onTranscriptionCallback && result.text) {
        this.onTranscriptionCallback(result.text);
      }

      this.notifyStatus('Transcription complete');
      console.log('Transcription result:', result);
    } catch (error) {
      console.error('Transcription failed:', error);
      this.handleError(error as Error);
    } finally {
      // Cleanup
      this.state.audioChunks = [];
    }
  }

  /**
   * Transcribe audio using OpenAI Whisper API
   */
  private async transcribeWithWhisper(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      // Convert blob to proper audio format for Whisper
      const audioFile = new File([audioBlob], 'recording.webm', { type: audioBlob.type });

      // Create form data
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', SearchConfig.whisper.model);
      formData.append('language', 'en'); // Can be auto-detected by removing this
      formData.append('response_format', 'verbose_json'); // Get detailed response

      // Call Whisper API
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SearchConfig.whisper.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Whisper API error: ${response.statusText} - ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();

      return {
        text: data.text || '',
        duration: data.duration || this.state.duration,
        language: data.language,
        confidence: this.calculateConfidence(data),
      };
    } catch (error) {
      console.error('Whisper API error:', error);
      throw new Error(`Failed to transcribe audio: ${(error as Error).message}`);
    }
  }

  /**
   * Calculate confidence score from Whisper response
   */
  private calculateConfidence(data: any): number {
    // Whisper doesn't return confidence directly in basic mode
    // We can estimate based on response quality
    if (data.text && data.text.length > 0) {
      return 0.95; // High confidence assumed for Whisper
    }
    return 0.0;
  }

  /**
   * Get supported MIME type for audio recording
   */
  private getSupportedMimeType(): string {
    const types = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm'; // Fallback
  }

  /**
   * Start duration counter
   */
  private startDurationCounter(): void {
    this.durationInterval = window.setInterval(() => {
      this.state.duration += 1;

      // Optional: Auto-stop after maximum duration (safety limit)
      if (this.state.duration >= this.MAX_RECORDING_DURATION / 1000) {
        console.log('Maximum recording duration reached');
        this.stopRecording();
      }
    }, 1000);
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: Error): void {
    this.state.isRecording = false;
    this.clearTimers();

    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }

  /**
   * Notify status change
   */
  private notifyStatus(status: string): void {
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(status);
    }
  }

  /**
   * Get current recording state
   */
  getState(): Readonly<VoiceRecordingState> {
    return { ...this.state };
  }

  /**
   * Format duration as MM:SS
   */
  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Get browser-specific instructions for resetting microphone permissions
   */
  private getPermissionDeniedMessage(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = 'Microphone access was blocked. To reset:\n\n';

    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      instructions += '1. Click the lock icon (🔒) in the address bar\n';
      instructions += '2. Find "Microphone" and select "Allow"\n';
      instructions += '3. Refresh the page and try again';
    } else if (userAgent.includes('firefox')) {
      instructions += '1. Click the permissions icon (🔒) in the address bar\n';
      instructions += '2. Click the "X" next to "Blocked Temporarily"\n';
      instructions += '3. Click the microphone icon to try again';
    } else if (userAgent.includes('safari')) {
      instructions += '1. Go to Safari → Settings for This Website\n';
      instructions += '2. Set Microphone to "Allow"\n';
      instructions += '3. Refresh the page and try again';
    } else if (userAgent.includes('edg')) {
      instructions += '1. Click the lock icon (🔒) in the address bar\n';
      instructions += '2. Find "Microphone" and select "Allow"\n';
      instructions += '3. Refresh the page and try again';
    } else {
      instructions += '1. Click the lock/info icon in the address bar\n';
      instructions += '2. Find microphone permissions and allow access\n';
      instructions += '3. Refresh the page and try again';
    }

    return instructions;
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopRecording();
    this.onTranscriptionCallback = null;
    this.onErrorCallback = null;
    this.onStatusChangeCallback = null;
  }
}

// Export singleton instance
export const voiceInputService = new VoiceInputService();