# Extension Verification Guide

This guide explains how to verify that the Appium Agent Tools extension is working correctly.

## Table of Contents

1. [Verifying Extension Load](#verifying-extension-load)
2. [Verifying Tools in GitHub Copilot](#verifying-tools-in-github-copilot)
3. [Testing Tools Manually](#testing-tools-manually)
4. [Troubleshooting](#troubleshooting)

---

## Verifying Extension Load

### Method 1: Check VS Code Output Console

1. **Press F5** to launch the extension in debug mode
2. A new VS Code window (Extension Development Host) will open
3. In the **Extension Development Host** window:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type: `Developer: Show Running Extensions`
   - Look for **"Appium Agent Tools"** in the list
   - It should show status: **Active**

### Method 2: Check Debug Console

1. In the **original VS Code window** (not the Extension Development Host), look at the **Debug Console** panel
2. You should see output like:
   ```
   Appium Agent Tools extension is now active
   All 7 Appium tools registered successfully
   ```

### Method 3: Check Extension Host Log

1. In the **Extension Development Host** window:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type: `Developer: Show Logs`
   - Select **Extension Host**
2. Look for entries related to "Appium Agent Tools" or the 7 tool registrations

---

## Verifying Tools in GitHub Copilot

### Prerequisites

- GitHub Copilot subscription (or Copilot Chat)
- VS Code with GitHub Copilot extension installed
- The Appium Agent Tools extension loaded (see above)

### Steps to Verify

1. **Open Copilot Chat**:
   - Press `Ctrl+Shift+I` (or `Cmd+Shift+I` on Mac)
   - Or click the Copilot icon in the Activity Bar

2. **Check Available Tools**:
   - In the Copilot Chat, type: `@workspace /api`
   - Or type: `What tools do you have available?`
   - Look for the 7 Appium tools in the response

3. **The 7 tools you should see**:
   - `appium_startSession` - Start Appium Session
   - `appium_stopSession` - Stop Appium Session
   - `appium_findElement` - Find UI Element
   - `appium_tap` - Tap Element or Coordinates
   - `appium_typeText` - Type Text
   - `appium_screenshot` - Capture Screenshot
   - `appium_pageSource` - Get Page Source

### Testing a Tool

Try asking Copilot to use a tool:

```
Can you check if Appium tools are available? Try to list the available Appium tools.
```

If the extension is working, Copilot should be able to see and describe the tools.

**Note**: To actually use the tools, you need:
- An Appium server running (default: http://127.0.0.1:4723)
- An Android device/emulator connected via ADB

---

## Testing Tools Manually

If you want to test the tools directly (without Copilot), you can check the extension's registration:

### Method 1: Developer Console

1. In the **Extension Development Host** window:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type: `Developer: Toggle Developer Tools`
2. In the Console tab, type:
   ```javascript
   vscode.lm.tools
   ```
3. This should show all registered Language Model tools, including the 7 Appium tools

### Method 2: Extension API

Create a simple test by opening a new file and running:

```typescript
// In Extension Development Host, open Command Palette
// Type: Developer: Inspect Context Keys
// Look for: languageModelToolsProvider
```

---

## Troubleshooting

### Extension Not Loading

**Issue**: Extension doesn't appear in Running Extensions

**Solutions**:
1. Check the Debug Console for errors
2. Verify `out/extension.js` exists (run `npm run compile`)
3. Check `package.json` has correct `main` field: `"./out/extension.js"`
4. Try reloading the Extension Development Host window

### Tools Not Visible in Copilot

**Issue**: Copilot doesn't see the Appium tools

**Solutions**:
1. Verify the extension is active (see Method 1 above)
2. Check that GitHub Copilot extension is installed and active
3. Reload VS Code (Extension Development Host window)
4. Check VS Code version is 1.90.0 or higher
5. Verify `package.json` has `contributes.languageModelTools` section

### Activation Events

The extension activates when:
- VS Code starts (if previously used)
- A Language Model tool is requested
- Specifically when `appium_startSession` tool is invoked

If the extension seems inactive, try:
1. Restart the Extension Development Host
2. Check the activation events in `package.json`

### Common Errors

#### "Cannot find module 'vscode'"

**Solution**: Run `npm install` to install dependencies

#### "Extension 'appium-tools.appium-agent-tools' CANNOT register tool"

**Solution**: This was fixed in a recent commit. Make sure you have the latest code with `displayName` and `modelDescription` fields in `package.json`

#### Compilation Errors

**Solution**: 
```bash
npm install
npm run compile
```

---

## Verification Checklist

Use this checklist to verify everything is working:

- [ ] Extension shows as "Active" in Running Extensions
- [ ] Debug Console shows "Appium Agent Tools extension is now active"
- [ ] Debug Console shows "All 7 Appium tools registered successfully"
- [ ] All 7 tools appear in `package.json` under `contributes.languageModelTools`
- [ ] GitHub Copilot can see the tools (if Copilot is installed)
- [ ] No errors in Debug Console or Extension Host Log
- [ ] Extension reloads correctly when code changes (watch mode)

---

## Next Steps

Once you've verified the extension is working:

1. **Start an Appium server**: `appium --port 4723`
2. **Connect an Android device/emulator**: `adb devices`
3. **Use Copilot to interact with your device** through the tools
4. **Check artifacts** in `.appium-artifacts/` folder (screenshots and page sources)

For detailed usage examples, see [USAGE.md](./USAGE.md).
