# Quick Reference Card - Voice Input & AI Search

## 🚀 Quick Start (30 Seconds)

### Open Search
```
Mac: Cmd + K
Windows/Linux: Ctrl + K
```

### Use Voice Input
```
1. Click 🎤 microphone icon
2. Speak your question
3. Click "Stop Recording"
4. Text appears → Press Enter
```

---

## 🎙️ Voice Input Commands

### Starting
- **Click mic icon** (🎤) → Recording starts immediately
- **First time**: Browser asks for permission → Click "Allow"

### While Recording
- **Speak naturally** - No rush, unlimited time
- **Watch timer** - Shows recording duration
- **Status messages** - "Recording..." "Processing..." etc.

### Stopping
- **Click "Stop Recording"** button
- **Or click mic icon** again
- **Processing**: Takes 3-7 seconds typically

---

## ✅ What to Say

### Good Examples
```
✅ "How do I configure SNMP discovery?"
✅ "What are the best practices for cloud discovery?"
✅ "Explain the CMDB relationship mapping process"
✅ "Show me the API integration documentation"
✅ "How do I set up incident management workflows?"
```

### Tips
- Speak at normal conversational pace
- Use technical terms naturally
- Take pauses if needed (no time limit)
- Speak clearly for best accuracy

---

## 🔍 Search Options

### Search Docs Tab
- Searches 822 documentation files
- Covers 5 modules (Admin, Discovery, CMDB, ITAM, ITSM)
- Version-specific results
- Instant results

### Search Web Tab
- Real-time web search (when APIs configured)
- Authentic URLs only
- External resources and tutorials
- AI-generated summary

---

## 💬 Chat Features

### Continue in Chat
- Click "Continue in Chat" button
- Opens persistent chat panel
- Full conversation context preserved
- Source citations included

### Chat Capabilities
- Unlimited response length (48,000 tokens)
- No truncation or cutoffs
- Complete technical explanations
- Multi-turn conversations

---

## ⚠️ Troubleshooting

### "Permission Denied"
→ Allow microphone in browser settings → Refresh page

### "API Not Configured"
→ Voice needs OpenAI Whisper setup (check with admin)

### Voice Not Working
→ Check browser compatibility (Chrome, Firefox, Safari, Edge)
→ Ensure HTTPS connection
→ Try different microphone

### Transcription Inaccurate
→ Reduce background noise
→ Speak more clearly
→ Use better microphone/headset
→ Edit text before searching

---

## ⌨️ Keyboard Shortcuts

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Open Search | Cmd + K | Ctrl + K |
| Submit Search | Enter | Enter |
| Close Dialog | Esc | Esc |
| Focus Search | Tab | Tab |

---

## 🎯 Best Practices

### For Voice Input
- ✅ Speak at normal pace
- ✅ Reduce background noise
- ✅ Review transcription before submitting
- ✅ Edit if needed
- ✅ Use for long/complex queries

### For Search
- ✅ Be specific with technical terms
- ✅ Use module names (Discovery, CMDB, etc.)
- ✅ Try different phrasings if needed
- ✅ Check both Docs and Web tabs
- ✅ Continue in Chat for detailed help

---

## 📊 Visual Indicators

### Recording States

**Ready** (Gray mic):
```
🎤 ← Click to start
```

**Recording** (Red mic):
```
🔴 Recording... 00:15
💡 Speak naturally
[Stop Recording]
```

**Processing** (Spinner):
```
⏳ Transcribing with Whisper API...
```

**Complete** (Text in field):
```
🔍 [Your transcribed text] 🎤
```

---

## ⏱️ Expected Times

| Action | Duration |
|--------|----------|
| Start recording | < 1 second |
| Speak (unlimited) | Your choice |
| Stop recording | < 1 second |
| Transcription | 3-7 seconds |
| Search results | < 1 second |
| AI response | 3-10 seconds |

---

## 🎓 Common Scenarios

### Quick Question
```
Cmd+K → Click 🎤 → "What is SNMP?" → Stop → Enter
Time: ~15 seconds total
```

### Detailed Query
```
Cmd+K → Click 🎤 → Speak for 1-2 minutes → Stop → Review → Enter
Time: ~2.5 minutes total
```

### Complex Conversation
```
Cmd+K → Type or speak → Get results → "Continue in Chat" → 
Multi-turn conversation with AI
Time: Ongoing as needed
```

---

## 🔧 Technical Specs

### Voice Input
- **Duration**: Unlimited (10 min safety limit)
- **Accuracy**: 99%+ for English
- **Languages**: 50+ supported
- **Technical Terms**: 95%+ accuracy
- **Cost**: $0.006 per minute

### AI Chat
- **Model**: GPT-4o (latest)
- **Token Limit**: 48,000 (with continuation)
- **Truncation**: Never (auto-continues)
- **Context**: Full conversation history
- **Cost**: Pay-per-token (~$0.01-0.30/query)

---

## 📚 Documentation

### Full Guides
- **Voice Setup**: `/docs/VOICE-INPUT-SETUP.md`
- **Voice Demo**: `/docs/VOICE-INPUT-DEMO.md`
- **API Config**: `/docs/API-TOKEN-CONFIGURATION.md`
- **Web Search**: `/docs/WEB-SEARCH-SETUP.md`
- **Verification**: `/docs/VERIFICATION-CHECKLIST.md`

### Quick Help
- **This Card**: `/docs/QUICK-REFERENCE.md`
- **Status**: `/docs/COMPLETE-FEATURE-STATUS.md`
- **Dashboard**: Open APIStatusDashboard component

---

## ✅ Quick Checks

### Is Voice Working?
- [ ] Click mic icon
- [ ] See recording indicator?
- [ ] Timer counting up?
- [ ] Can stop recording?
- [ ] Transcription appears?

### Is AI Working?
- [ ] Type question in search
- [ ] Get AI response?
- [ ] Response is complete?
- [ ] No cutoffs or truncation?
- [ ] Can continue in chat?

### Is Search Working?
- [ ] Search results appear?
- [ ] Relevant documentation found?
- [ ] Web search tab available?
- [ ] Links are clickable?
- [ ] Citations provided?

---

## 🆘 Need Help?

### For Users
1. Try this quick reference first
2. Check error messages (they guide you)
3. Review demo guide: `/docs/VOICE-INPUT-DEMO.md`
4. Ask admin for help

### For Admins
1. Check configuration: `/lib/search/config.ts`
2. Verify API keys are set
3. Review setup guides in `/docs/`
4. Check browser console for errors

---

## 🎯 Success Tips

1. **Speak naturally** - Don't rush, system is patient
2. **Review transcriptions** - Quick glance before searching
3. **Use for long queries** - Voice beats typing for complex questions
4. **Try both search tabs** - Docs for official, Web for community
5. **Continue to chat** - For deeper discussions and follow-ups

---

**Print this card or bookmark for quick reference!** 📋✨

**Remember**: Voice input + AI search = Fastest way to find answers in documentation! 🚀
