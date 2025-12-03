# How to Reset Microphone Permission - Visual Guide

## 🎯 Problem: "Microphone permission denied" or "blocked"

If you see this error, it means you previously clicked "Block" when the browser asked for microphone access, or your browser is set to block microphone access for this site.

**Don't worry - it's easy to fix!** Follow the instructions below for your browser.

---

## 🌐 Chrome / Edge (Chromium-based browsers)

### Method 1: Quick Fix from Address Bar

**Steps:**

1. **Look at the address bar** (where the URL is)
2. **On the left side**, you'll see one of these icons:
   - 🔒 Lock icon (secure site)
   - ⓘ Info icon
   - 🎤❌ Camera/mic icon with an X (if blocked)

3. **Click that icon**

4. **Find "Microphone"** in the dropdown

5. **You'll see it's set to "Block"** - Click the dropdown and change it to **"Allow"**

6. **Close the error message** in the app

7. **Click the microphone icon again** - it should work now!

### Method 2: Site Settings (More thorough)

**Steps:**

1. **Click the lock icon** 🔒 in the address bar

2. **Click "Site Settings"** (at the bottom of the dropdown)

3. **Scroll down to "Permissions"**

4. **Find "Microphone"**

5. **Change from "Block" to "Allow"**

6. **Close the settings tab**

7. **Refresh the page** (F5 or Cmd/Ctrl + R)

8. **Click the microphone icon** - permission dialog should appear (or recording starts if you chose "Allow")

### Method 3: Global Settings (If still not working)

**Steps:**

1. **Copy this and paste in address bar:** `chrome://settings/content/microphone`
   - For Edge: `edge://settings/content/microphone`

2. **Press Enter**

3. **Look for two sections:**
   - "Sites can ask to use your microphone" ← Should be **ON**
   - "Not allowed to use your microphone" ← Check if your site is listed here

4. **If your site is in "Not allowed":**
   - Click the trash icon next to it to remove it

5. **Go back to the app** and refresh the page

6. **Click microphone icon** - dialog will appear

---

## 🦊 Firefox

### Method 1: Quick Reset

**Steps:**

1. **Click the lock icon** 🔒 in the address bar

2. **You'll see "Microphone Blocked"** (or similar)

3. **Click the arrow** next to it (▶️)

4. **Click "Clear This Permission"** or "X" icon

5. **Refresh the page** (F5)

6. **Click the microphone icon** - permission dialog will appear

### Method 2: Page Info (More thorough)

**Steps:**

1. **Click the lock icon** 🔒 in address bar

2. **Click "More information"** button

3. **Click the "Permissions" tab**

4. **Find "Use the Microphone"**

5. **Uncheck "Use Default"** if checked

6. **Select "Allow"** from the dropdown

7. **Close the dialog**

8. **Refresh the page**

9. **Click microphone icon** - should work now

### Method 3: Settings Page

**Steps:**

1. **Copy this and paste in address bar:** `about:preferences#privacy`

2. **Press Enter**

3. **Scroll down to "Permissions"**

4. **Click "Settings" button** next to "Microphone"

5. **Find your site** in the list

6. **Change "Status" from "Blocked" to "Allow"**

7. **Click "Save Changes"**

8. **Go back and refresh the page**

---

## 🧭 Safari (macOS)

### Method 1: Safari Settings for This Website

**Steps:**

1. **In Safari menu bar, click "Safari"**

2. **Click "Settings for This Website"**
   - Alternative: **Right-click on the address bar** → "Settings for This Website"

3. **Find "Microphone"**

4. **Change from "Deny" to "Allow"**

5. **Close the settings**

6. **Refresh the page** (Cmd + R)

7. **Click microphone icon** - should work now

### Method 2: General Safari Settings

**Steps:**

1. **Safari menu** → **Settings** (or Cmd + ,)

2. **Click "Websites" tab**

3. **In the left sidebar, click "Microphone"**

4. **Find your website** in the right panel

5. **Change dropdown from "Deny" to "Allow"**

6. **Close Settings**

7. **Refresh the page**

8. **Click microphone icon**

### Method 3: macOS System Permissions

If Safari itself doesn't have permission:

1. **Apple menu** → **System Settings**

2. **Click "Privacy & Security"**

3. **Click "Microphone"** in the list

4. **Find "Safari"** and make sure the toggle is **ON** ✅

5. **Restart Safari** completely (quit and reopen)

6. **Go back to the site** and try again

---

## 📱 Mobile Browsers

### Chrome on Android

**Steps:**

1. **Tap the lock icon** or **info icon** in address bar

2. **Tap "Permissions"** or **"Site settings"**

3. **Tap "Microphone"**

4. **Select "Allow"**

5. **Go back** and **refresh the page**

6. **Tap microphone icon**

### Safari on iOS

**Steps:**

1. **Tap the "aA" button** in the address bar

2. **Tap "Website Settings"**

3. **Find "Microphone"**

4. **Change to "Allow"**

5. **Tap "Done"**

6. **Refresh the page**

7. **Tap microphone icon**

### Mobile Chrome/Firefox: System Settings

If the above doesn't work, check system-level permissions:

**Android:**
1. Settings → Apps → Chrome (or Firefox)
2. Permissions → Microphone
3. Ensure it's set to "Allow"

**iOS:**
1. Settings → Safari (or Chrome)
2. Find Microphone
3. Toggle ON

---

## ✅ How to Know It Worked

After following the steps above, here's what should happen:

### First Time After Reset

1. **Click the microphone icon** 🎤
2. **Browser shows a popup/dialog:**
   ```
   [Your site] wants to use your microphone
   
   [Block]  [Allow]
   ```
3. **Click "Allow"**
4. **Recording starts** - you'll see:
   - 🔴 Red pulsing icon
   - Timer counting up (00:01, 00:02, ...)
   - "Stop Recording" button

### Subsequent Uses

1. **Click microphone icon** 🎤
2. **Recording starts immediately** (no popup)
3. **Permission is now saved!**

---

## 🧪 Quick Test

After resetting permissions, test with these steps:

```
1. Open the search dialog (Cmd/Ctrl + K)
2. Click the microphone icon 🎤
3. You should see: Permission dialog OR recording starts
4. If dialog appears: Click "Allow"
5. Speak: "This is a test"
6. Click "Stop Recording"
7. Wait 3-5 seconds
8. Your text should appear in the search box ✅
```

---

## ❓ Still Not Working?

### Check These Common Issues

#### Issue 1: Not HTTPS
**Problem**: Site is using `http://` instead of `https://`

**Solution**: Microphone only works on:
- ✅ `https://yoursite.com`
- ✅ `http://localhost`
- ✅ `http://127.0.0.1`
- ❌ `http://yoursite.com` ← Won't work!

**Fix**: Use HTTPS or test on localhost

#### Issue 2: No Microphone Connected
**Problem**: No physical microphone detected

**Solution**:
- **Laptop**: Built-in mic should work
- **Desktop**: Plug in external mic or webcam
- **Test mic**: 
  - Windows: Settings → Sound → Test microphone
  - Mac: System Settings → Sound → Input → Test

#### Issue 3: Microphone in Use
**Problem**: Another app is using the microphone

**Solution**: Close these apps:
- Zoom
- Microsoft Teams
- Skype
- Discord
- Google Meet
- Any video recording software

#### Issue 4: Browser Extensions Blocking
**Problem**: Ad blocker or privacy extension interfering

**Solution**:
1. **Try in Incognito/Private mode** (extensions disabled)
2. If it works there, disable extensions one by one to find culprit
3. Add your site to extension's allowlist

#### Issue 5: Antivirus/Firewall Blocking
**Problem**: Security software blocking microphone access

**Solution**:
1. Temporarily disable antivirus
2. If mic works, add browser to antivirus allowlist
3. Re-enable antivirus

---

## 🎬 Video Tutorial Equivalent

If you prefer visual learning, here's what to search for on YouTube:

- "How to allow microphone in Chrome"
- "How to reset site permissions in Firefox"
- "How to enable microphone in Safari"
- "Fix microphone permission denied [your browser]"

---

## 🔄 Complete Reset (Nuclear Option)

If NOTHING works, try this complete reset:

### Chrome/Edge

1. `chrome://settings/content/microphone` (or `edge://...`)
2. Remove site from all lists
3. Clear browsing data (chrome://settings/clearBrowserData)
   - Time range: "All time"
   - Check "Cookies and site data"
   - Check "Cached images and files"
4. Restart browser completely (close all windows)
5. Visit site again - should ask for permission

### Firefox

1. `about:preferences#privacy`
2. Scroll to "Cookies and Site Data"
3. Click "Manage Data"
4. Search for your site
5. Remove it
6. Click "Settings" next to Microphone
7. Remove your site
8. Restart Firefox
9. Visit site again

### Safari

1. Safari → Settings → Privacy
2. Click "Manage Website Data"
3. Search for your site
4. Remove it
5. Safari → Settings → Websites → Microphone
6. Remove your site from all lists
7. Restart Safari
8. Visit site again

---

## 📞 Need More Help?

If you've tried everything above and it still doesn't work:

### Collect This Information

```
Browser: Chrome 120 / Firefox 121 / Safari 17 / Edge 120
Operating System: Windows 11 / macOS 14 / Linux
URL: https://yoursite.com (or localhost)
What you see: [Screenshot or exact error message]
What you tried: [List steps you followed]
Microphone hardware: Built-in / External / Webcam
Other apps using mic: Yes / No - which ones?
```

### Where to Get Help

1. **Documentation**: `/docs/MICROPHONE-PERMISSIONS.md`
2. **Browser Help**:
   - Chrome: https://support.google.com/chrome/answer/2693767
   - Firefox: https://support.mozilla.org/en-US/kb/permissions-manager
   - Safari: https://support.apple.com/guide/safari/websites-ibrwe2159f50/mac
3. **Contact Support**: Provide the information above

---

## ✅ Summary

**The key steps** for all browsers:

1. ✅ Find the **lock icon** or **permissions icon** in address bar
2. ✅ Look for **"Microphone"** setting
3. ✅ Change from **"Block"** to **"Allow"**
4. ✅ **Refresh** the page
5. ✅ **Click microphone** icon again

**That's it!** 🎉

The permission dialog should appear (first time) or recording should start immediately (if you already allowed it).

---

**Remember**: Browser permissions are there to protect your privacy. The first time you use voice input, it's **normal** for the browser to ask for permission. That's a good thing! 🔒✅
