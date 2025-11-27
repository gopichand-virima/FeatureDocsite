import { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type FeedbackType = 'positive' | 'negative' | null;

interface FeedbackData {
  type: FeedbackType;
  role?: string;
  reasons: string[];
  comments: string;
}

export function FeedbackSection() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [submissionCount, setSubmissionCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [otherRoleText, setOtherRoleText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const maxSubmissions = 2;
  const canSubmit = submissionCount < maxSubmissions;

  const positiveReasons = [
    { id: 'clear-explanations', label: 'Clear explanations' },
    { id: 'good-examples', label: 'Good examples and use cases' },
    { id: 'easy-to-follow', label: 'Easy to follow' },
    { id: 'comprehensive', label: 'Comprehensive coverage' },
    { id: 'well-organized', label: 'Well organized' },
    { id: 'helpful-visuals', label: 'Helpful screenshots and diagrams' },
  ];

  const negativeReasons = [
    { id: 'unclear-instructions', label: 'Unclear instructions' },
    { id: 'missing-information', label: 'Missing information' },
    { id: 'outdated-content', label: 'Outdated content' },
    { id: 'poor-examples', label: 'Insufficient examples' },
    { id: 'hard-to-navigate', label: 'Hard to navigate' },
    { id: 'technical-errors', label: 'Technical errors or inaccuracies' },
  ];

  const roles = [
    { value: 'developer', label: 'Developer' },
    { value: 'administrator', label: 'System Administrator' },
    { value: 'end-user', label: 'End User' },
    { value: 'manager', label: 'IT Manager' },
    { value: 'analyst', label: 'Business Analyst' },
    { value: 'other', label: 'Other' },
  ];

  const handleThumbClick = (type: FeedbackType) => {
    if (!canSubmit && !isSubmitted) return;
    
    // If clicking the same button again, close the form
    if (feedbackType === type && showForm) {
      setShowForm(false);
      setFeedbackType(null);
      setSelectedReasons([]);
      setComments('');
      setNpsScore(null);
      setOtherRoleText('');
      return;
    }
    
    setFeedbackType(type);
    setShowForm(true);
    setIsSubmitted(false);
    setSelectedReasons([]);
    setComments('');
    setNpsScore(null);
    setOtherRoleText('');
  };

  const handleReasonToggle = (reasonId: string) => {
    setSelectedReasons(prev =>
      prev.includes(reasonId)
        ? prev.filter(id => id !== reasonId)
        : [...prev, reasonId]
    );
  };

  const handleSubmit = async () => {
    if (!feedbackType) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const feedbackData: FeedbackData = {
      type: feedbackType,
      role: selectedRole === 'other' ? otherRoleText : selectedRole,
      reasons: selectedReasons,
      comments,
    };

    try {
      // Get current page information for context
      const pageUrl = window.location.href;
      const pageTitle = document.title;
      
      // Format the email content
      const emailContent = {
        to_email: 'gopichand.y@virima.com',
        from_name: 'Virima Documentation Feedback',
        page_url: pageUrl,
        page_title: pageTitle,
        feedback_type: feedbackType === 'positive' ? '👍 Positive' : '👎 Negative',
        user_role: feedbackData.role || 'Not specified',
        reasons: selectedReasons.length > 0 
          ? selectedReasons.map(r => reasons.find(reason => reason.id === r)?.label).join(', ')
          : 'None selected',
        comments: comments || 'No additional comments',
        nps_score: feedbackType === 'positive' && npsScore !== null 
          ? `${npsScore}/10` 
          : 'N/A',
        timestamp: new Date().toLocaleString(),
      };

      // Send via EmailJS
      // Note: You need to set up EmailJS account and replace these IDs
      const emailjs = (await import('emailjs-com@3.2.0')).default;
      
      await emailjs.send(
        'YOUR_SERVICE_ID',  // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        emailContent,
        'YOUR_PUBLIC_KEY'   // Replace with your EmailJS public key
      );

      console.log('Feedback submitted:', feedbackData);
      if (feedbackType === 'positive' && npsScore !== null) {
        console.log('NPS Score:', npsScore);
      }

      setSubmissionCount(prev => prev + 1);
      setIsSubmitted(true);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to send feedback:', error);
      setSubmitError('Failed to send feedback. Please try again or contact support directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModify = () => {
    setIsSubmitted(false);
    setShowForm(true);
  };

  const reasons = feedbackType === 'positive' ? positiveReasons : negativeReasons;

  return (
    <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-slate-200">
      <div className="max-w-2xl">
        <div className="text-lg font-semibold text-slate-900 mb-2">Was this page helpful?</div>
        <p className="text-sm text-slate-600 mb-4 sm:mb-6">
          Your feedback helps us improve our documentation.
        </p>

        {/* Thumbs Up/Down Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleThumbClick('positive')}
            disabled={!canSubmit && !isSubmitted}
            className={`flex items-center gap-2 transition-all ${
              feedbackType === 'positive'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 hover:bg-emerald-100'
                : 'hover:bg-slate-50'
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
            <span>Yes</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleThumbClick('negative')}
            disabled={!canSubmit && !isSubmitted}
            className={`flex items-center gap-2 transition-all ${
              feedbackType === 'negative'
                ? 'bg-red-50 border-red-500 text-red-700 hover:bg-red-100'
                : 'hover:bg-slate-50'
            }`}
          >
            <ThumbsDown className="w-5 h-5" />
            <span>No</span>
          </Button>

          {!canSubmit && !isSubmitted && (
            <span className="text-sm text-slate-500">
              (Maximum feedback submissions reached)
            </span>
          )}
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-emerald-900 mb-2">
                  Thank you for your feedback!
                </p>
                <p className="text-sm text-emerald-700">
                  We appreciate you taking the time to help us improve our documentation.
                </p>
                {submissionCount < maxSubmissions && (
                  <Button
                    variant="link"
                    onClick={handleModify}
                    className="text-emerald-700 hover:text-emerald-800 px-0 mt-2"
                  >
                    Modify your feedback ({maxSubmissions - submissionCount} {maxSubmissions - submissionCount === 1 ? 'change' : 'changes'} remaining)
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Form */}
        {showForm && feedbackType && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-6">
            <div>
              <div className="font-semibold text-slate-900 mb-4">
                {feedbackType === 'positive' 
                  ? 'What did you find helpful?' 
                  : 'What can we improve?'}
              </div>

              {/* Role Selection */}
              <div className="mb-6">
                <Label htmlFor="role" className="text-slate-700 mb-2 block">
                  I am a: <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role" className="bg-white">
                    <SelectValue placeholder="Select your role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRole === 'other' && (
                  <Textarea
                    id="other-role"
                    value={otherRoleText}
                    onChange={(e) => setOtherRoleText(e.target.value)}
                    placeholder="Please specify your role..."
                    className="min-h-[50px] bg-white resize-none mt-2"
                    rows={2}
                  />
                )}
              </div>

              {/* NPS Question - Only for positive feedback */}
              {feedbackType === 'positive' && (
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <Label className="text-slate-700 mb-3 block">
                    How likely are you to recommend this event to a <span className="text-emerald-600">friend or colleague?</span>
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setNpsScore(score)}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md border-2 transition-all flex-shrink-0 text-sm sm:text-base ${
                            npsScore === score
                              ? 'bg-emerald-600 border-emerald-600 text-white scale-110 shadow-md'
                              : 'border-slate-300 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Not at all likely</span>
                      <span>Extremely likely</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reasons Checkboxes */}
              <div className="space-y-3 mb-6">
                {reasons.map(reason => (
                  <div key={reason.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={reason.id}
                      checked={selectedReasons.includes(reason.id)}
                      onCheckedChange={() => handleReasonToggle(reason.id)}
                    />
                    <Label
                      htmlFor={reason.id}
                      className="text-sm text-slate-700 cursor-pointer"
                    >
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Comments */}
              <div>
                <Label htmlFor="comments" className="text-slate-700 mb-2 block">
                  Additional Comments
                </Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Tell us what you think, suggestions for improvement, or any issues you encountered..."
                  className="min-h-[100px] bg-white resize-none"
                  rows={4}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Note: Please do not include any personal or sensitive information.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <Button
                onClick={handleSubmit}
                disabled={!selectedRole || (selectedRole === 'other' && !otherRoleText.trim())}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFeedbackType(null);
                  setSelectedReasons([]);
                  setComments('');
                  setSelectedRole('');
                  setNpsScore(null);
                  setOtherRoleText('');
                }}
              >
                Cancel
              </Button>
              {!selectedRole && (
                <span className="text-xs text-slate-500">
                  * Role is required
                </span>
              )}
              {selectedRole === 'other' && !otherRoleText.trim() && (
                <span className="text-xs text-slate-500">
                  * Please specify your role
                </span>
              )}
              {submitError && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>{submitError}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}