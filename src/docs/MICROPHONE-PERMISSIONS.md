# Microphone Permissions - Troubleshooting Guide

## 🎤 How Browser Permissions Work

When you click the microphone icon for the first time, your browser should show a permission dialog asking if you want to allow microphone access.

---

## ✅ Expected Behavior

### First Click (No Permission Yet)

```
You click 🎤
    ↓
Browser shows dialog:
┌─────────────────────────────────────┐
│  yoursite.com wants to use          │
│  your Microphone                    │
│                                     │
│  [Block]  [Allow]                   │
└─────────────────────────────────────┘
    ↓
You click [Allow]
    ↓
Site added to "Allowed" list in settings
    ↓
Recording starts immediately
```

### Subsequent Clicks (Permission Granted)

```
You click 🎤
    ↓
Recording starts immediately (no dialog)
```

---

## ❌ Common Issues

### Issue 1: "Permission Denied" Error Immediately

**Symptoms**: Error message appears without showing permission dialog

**Possible Causes**:
1. Permission was previously denied
2. Browser settings blocking all sites
3. Not using HTTPS (except localhost)
4. Browser doesn't support getUserMedia API

**Solutions**:

#### Solution A: Check if Permission Was Previously Denied

**Chrome/Edge**:
1. Click the lock icon in address bar (or info icon ⓘ)
2. Look for "Microphone" setting
3. If set to "Block", change to "Ask" or "Allow"
4. Refresh the page
5. Click microphone icon again

**Firefox**:
1. Click the lock icon in address bar
2. Click "More information" → "Permissions"
3. Find "Use the Microphone"
4. If "Blocked", change to "Ask" or "Allow"
5. Refresh the page

**Safari**:
1. Safari menu → Settings for This Website
2. Change "Microphone" from "Deny" to "Ask" or "Allow"
3. Refresh the page

#### Solution B: Check Global Browser Settings

**Chrome/Edge**:
1. Go to `chrome://settings/content/microphone`
2. Ensure "Sites can ask to use your microphone" is enabled
3. Check "Not allowed to use your microphone" list
4. If your site is there, remove it
5. Refresh the page

**Firefox**:
1. Go to `about:preferences#privacy`
2. Scroll to "Permissions"
3. Click "Settings" next to "Microphone"
4. Find your site and change to "Allow"

**Safari**:
1. Safari → Settings → Websites → Microphone
2. Change default to "Ask" or "Allow"

#### Solution C: Verify HTTPS Connection

**Microphone access requires HTTPS** (except localhost)

Check your URL:
- ✅ `https://yoursite.com` - Will work
- ✅ `http://localhost:3000` - Will work
- ✅ `http://127.0.0.1:3000` - Will work
- ❌ `http://yoursite.com` - Won't work

If using HTTP (not localhost), you need to:
1. Enable HTTPS on your server
2. Or test on localhost for development

---

### Issue 2: No Microphone Detected

**Symptoms**: "No microphone detected" error

**Causes**:
- No microphone hardware connected
- Microphone disabled in OS settings
- Microphone being used by another app

**Solutions**:

**Windows**:
1. Settings → Privacy & Security → Microphone
2. Ensure "Let apps access your microphone" is ON
3. Check if specific apps are allowed
4. Test microphone in Sound Settings

**macOS**:
1. System Settings → Privacy & Security → Microphone
2. Ensure browser (Chrome, Safari, etc.) has checkbox enabled
3. May need to restart browser after enabling

**Linux**:
1. Check if microphone is detected: `arecord -l`
2. Test recording: `arecord -d 5 test.wav`
3. Check PulseAudio settings

---

### Issue 3: Permission Dialog Doesn't Appear

**Symptoms**: Clicking mic does nothing, no dialog shows

**Possible Causes**:
1. User gesture context lost (technical issue)
2. Browser blocking all permission prompts
3. Content Security Policy blocking

**Solutions**:

1. **Refresh the page** and try again
2. **Check browser extensions** - disable ad blockers temporarily
3. **Try in incognito/private mode** - rules out extension interference
4. **Clear browser cache** - may fix corrupt permission state
5. **Update browser** - ensure latest version

---

## 🧪 Testing Permission Flow

### Test 1: Fresh Start (Incognito)

1. Open browser in incognito/private mode
2. Navigate to your site
3. Click microphone icon
4. **Expected**: Permission dialog appears
5. Click "Allow"
6. **Expected**: Recording starts immediately

### Test 2: Verify Persistence

1. After allowing permission (Test 1)
2. Refresh the page
3. Click microphone icon
4. **Expected**: Recording starts immediately (no dialog)

### Test 3: Check Browser Settings

**Chrome/Edge**:
1. Go to `chrome://settings/content/microphone`
2. **Expected**: Your site appears in "Allowed" list

**Firefox**:
1. Click lock icon → Permissions → Microphone
2. **Expected**: Shows "Allowed"

---

## 🔧 Developer Debugging

### Check in Browser Console

```javascript
// Test 1: Check if API is supported
console.log('getUserMedia supported:', 
  !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));

// Test 2: Check secure context
console.log('Is HTTPS or localhost:', window.isSecureContext);

// Test 3: Query permission state (Chrome/Edge/Firefox)
navigator.permissions.query({ name: 'microphone' })
  .then(result => console.log('Permission state:', result.state))
  .catch(err => console.log('Permission API not supported:', err));

// Test 4: Manually trigger getUserMedia (must be in click handler)
// Run this in console after clicking page somewhere
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    console.log('SUCCESS: Microphone access granted');
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => {
    console.error('FAILED:', err.name, err.message);
  });
```

### Common Error Names

| Error Name | Meaning | Solution |
|------------|---------|----------|
| `NotAllowedError` | Permission denied | Check browser settings |
| `NotFoundError` | No microphone | Connect microphone |
| `NotReadableError` | Mic in use | Close other apps |
| `SecurityError` | Not HTTPS | Use HTTPS or localhost |
| `AbortError` | Dialog dismissed | Try again |

---

## 📋 Quick Troubleshooting Checklist

When microphone doesn't work, check these in order:

- [ ] **HTTPS or localhost?** (check URL bar)
- [ ] **Browser supports getUserMedia?** (Chrome, Edge, Firefox, Safari 14+)
- [ ] **Permission previously denied?** (check lock icon in address bar)
- [ ] **Global microphone setting enabled?** (browser settings)
- [ ] **Microphone hardware connected?** (test in OS settings)
- [ ] **Microphone allowed in OS?** (macOS Privacy settings)
- [ ] **Not blocked by extension?** (try incognito mode)
- [ ] **Browser up to date?** (check for updates)

---

## 🎯 Per-Browser Instructions

### Chrome/Edge (Chromium)

**Allow Permission**:
1. Click lock icon in address bar
2. Click "Site settings"
3. Find "Microphone" → Change to "Allow"
4. Refresh page

**Reset All Permissions**:
1. Go to `chrome://settings/content/microphone`
2. Remove site from any block lists
3. Refresh page and try again

### Firefox

**Allow Permission**:
1. Click lock icon in address bar
2. Click arrow next to "Microphone Blocked"
3. Click "Clear This Permission"
4. Refresh page - dialog will appear on next click

**Reset All Permissions**:
1. Go to `about:preferences#privacy`
2. Scroll to "Permissions" → "Microphone" → "Settings"
3. Remove site or change to "Allow"

### Safari

**Allow Permission**:
1. Safari menu → Settings for This Website
2. Microphone → Change to "Allow"
3. Refresh page

**Global Settings**:
1. Safari → Settings → Websites → Microphone
2. Change default to "Ask"
3. Add exceptions as needed

---

## 🆘 Still Not Working?

### Last Resort Solutions

1. **Try a different browser** - test in Chrome, Firefox, and Safari
2. **Restart browser completely** - close all windows and reopen
3. **Restart computer** - fixes OS-level permission issues
4. **Check antivirus/firewall** - may block microphone access
5. **Test on different device** - isolate hardware vs software issue

### Get Technical Support

If nothing works, collect this information:

```
Browser: Chrome 120 (or Firefox 121, Safari 17, etc.)
OS: Windows 11 / macOS 14 / Ubuntu 22.04
URL: https://yoursite.com or http://localhost:3000
HTTPS: Yes / No
Error message: [exact error text]
Console errors: [open DevTools → Console tab]
Permission state: chrome://settings/content/microphone
```

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Browser shows permission dialog on first click
2. ✅ After allowing, recording starts immediately
3. ✅ Site appears in browser's "Allowed" list
4. ✅ Subsequent clicks start recording without dialog
5. ✅ Red recording indicator appears with timer
6. ✅ After speaking, transcription appears in search field

---

## 📚 Additional Resources

- **Chrome Permissions**: https://support.google.com/chrome/answer/2693767
- **Firefox Permissions**: https://support.mozilla.org/en-US/kb/permissions-manager-give-ability-store-passwords-set-cookies-more
- **Safari Permissions**: https://support.apple.com/guide/safari/websites-ibrwe2159f50/mac
- **MDN getUserMedia**: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

---

**Remember**: The browser permission dialog is a **security feature** - it protects you from websites accessing your microphone without permission. The first-time prompt is normal and expected behavior!
