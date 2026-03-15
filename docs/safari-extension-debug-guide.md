# Safari Extension Debug Build — Step-by-Step Guide

## How to Get an Unsigned/Debug Safari Extension to Show Up

### Prerequisites
- macOS with Xcode installed
- A Safari Web Extension Xcode project (built or ready to build)

---

### Step 1: Enable Developer Features in Safari
1. Open **Safari**
2. Go to **Safari → Settings → Advanced**
3. Check **"Show features for web developers"**
4. Close Settings

### Step 2: Allow Unsigned Extensions
1. In Safari's **menu bar** (top of screen), click **Develop**
2. Click **"Allow Unsigned Extensions"**
3. Enter your Mac password when prompted
4. ⚠️ **Note:** This resets every time you quit Safari — you'll need to re-enable it each session

### Step 3: Build the Extension
Option A — **Command line:**
```bash
cd /path/to/your/extension/XcodeProject
xcodebuild -scheme "YourScheme (macOS)" -configuration Debug build
```

Option B — **Xcode:**
1. Open the `.xcodeproj` file
2. Select the macOS scheme
3. Press **Cmd+B** to build

### Step 4: Launch the Host App (CRITICAL!)
- Open the built `.app` from DerivedData or press **Cmd+R** in Xcode
- The host app is typically found at:
  ```
  ~/Library/Developer/Xcode/DerivedData/<ProjectName>-<hash>/Build/Products/Debug/<AppName>.app
  ```
- **⚠️ The host app MUST stay running!** Safari only detects debug extensions while their parent app is open. If the app quits or crashes, the extension disappears from Safari.

### Step 5: Quit and Reopen Safari (CRITICAL!)
1. **Cmd+Q** to fully quit Safari (not just close the window)
2. Reopen Safari
3. This forces Safari to rescan for available extensions

### Step 6: Enable the Extension
1. Go to **Safari → Settings → Extensions**
2. Your extension should now appear in the list
3. Check the box to enable it
4. Grant any permissions it requests

---

## Troubleshooting Checklist

| Problem | Fix |
|---|---|
| Extension not in the list | Is the host app running? Launch it. |
| Still not in the list | Quit Safari fully (Cmd+Q) and reopen. |
| Still nothing | Re-check Develop → Allow Unsigned Extensions. |
| Was working, now gone | "Allow Unsigned Extensions" resets per session. Re-enable it, and make sure the host app is still running. |
| Extension visible but grayed out | Click on it and grant the required permissions. |

---

## Quick Command Reference

**Find your built app:**
```bash
find ~/Library/Developer/Xcode/DerivedData -name "YourApp.app" -maxdepth 5 2>/dev/null
```

**Check if your extension is registered:**
```bash
pluginkit -mAvvv -p com.apple.Safari.web-extension 2>&1 | grep -i "your-extension-name"
```

**Check if the host app is running:**
```bash
pgrep -fl "YourAppName"
```

---

## TL;DR
The three things that trip people up every time:
1. 🔑 **Allow Unsigned Extensions** (resets every Safari session)
2. 🚀 **Host app must be running** (not just built — actually running)
3. 🔄 **Quit and reopen Safari** (forces it to detect new extensions)
