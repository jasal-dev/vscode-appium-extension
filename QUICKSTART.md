# Quick Start Guide

Get started with Appium Agent Tools in 5 minutes.

## For Developers (Debug Mode)

1. **Setup**:
   ```bash
   git clone <repository-url>
   cd vscode-appium-extension
   npm install
   npm run compile
   ```

2. **Launch**:
   - Open the project in VS Code
   - Press **F5** to launch Extension Development Host

3. **Verify**:
   - In Extension Development Host, press `Ctrl+Shift+P`
   - Type: `Developer: Show Running Extensions`
   - Look for "Appium Agent Tools" (should be **Active**)

4. **Test with Copilot**:
   - Open GitHub Copilot Chat (`Ctrl+Shift+I`)
   - Ask: "What Appium tools are available?"
   - You should see 8 tools listed

**See**: [VERIFICATION.md](./VERIFICATION.md) for detailed verification steps

---

## For Users (Production Mode)

1. **Get the VSIX**:
   - Download `appium-agent-tools-0.1.0.vsix` from releases
   - Or build it: `npm run package`

2. **Install**:
   - Open VS Code
   - Extensions → "..." → "Install from VSIX..."
   - Select the `.vsix` file
   - Reload VS Code

3. **Verify**:
   - Extensions → Search "Appium Agent Tools"
   - Should show as **Installed**

4. **Use with Copilot**:
   - The 8 tools are now available to GitHub Copilot
   - Start Appium server: `appium --port 4723`
   - Connect device: `adb devices`
   - Ask Copilot to automate Android tasks

**See**: [PACKAGING.md](./PACKAGING.md) for complete installation instructions

---

## The 8 Tools

When the extension is active, these tools are available to AI agents:

| Tool | Display Name | Purpose |
|------|--------------|---------|
| `appium_startSession` | Start Appium Session | Connect to Appium and start session |
| `appium_stopSession` | Stop Appium Session | Terminate active session |
| `appium_findElement` | Find UI Element | Locate elements by id, xpath, etc. |
| `appium_tap` | Tap Element or Coordinates | Tap elements or screen coordinates |
| `appium_typeText` | Type Text | Enter text into input fields |
| `appium_swipe` | Swipe Up or Down | Perform vertical swipe gestures |
| `appium_screenshot` | Capture Screenshot | Save device screenshot |
| `appium_pageSource` | Get Page Source | Get UI hierarchy XML |

---

## Common Commands

```bash
# Development
npm install              # Install dependencies
npm run compile          # Build TypeScript
npm run watch           # Watch mode (auto-rebuild)

# Packaging
npm run package         # Create VSIX file

# Testing
# Press F5 in VS Code to launch debug mode
```

---

## Common Questions

### How do I know if it's working?

**Quick check**:
1. Press `Ctrl+Shift+P` → `Developer: Show Running Extensions`
2. Look for "Appium Agent Tools" with **Active** status
3. Open Copilot Chat and ask about Appium tools

### Where are the tools visible?

The tools are **not visible to you** directly. They are visible to:
- GitHub Copilot
- Other AI agents that support VS Code Language Model Tools
- Extensions that query registered tools

You interact with them **through AI agents**.

### What do I need to use the tools?

**To register tools**: Just install the extension
**To actually use tools**:
- Appium server running (e.g., `appium --port 4723`)
- Android device/emulator connected (`adb devices`)
- GitHub Copilot or compatible AI agent

### How do I create a distributable?

```bash
npm run package
```

This creates `appium-agent-tools-0.1.0.vsix` which you can:
- Share with team members
- Upload to GitHub releases
- Install on any VS Code instance

### Debug vs Production mode?

**Debug Mode** (F5):
- For development
- Hot reload on code changes
- Detailed logging
- Runs in separate window

**Production Mode** (VSIX install):
- For end users
- No hot reload
- Optimized code
- Runs in main VS Code

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Extension not loading | Check Debug Console for errors, run `npm run compile` |
| Tools not in Copilot | Verify extension is Active, reload VS Code |
| Can't create VSIX | Run `npm install`, ensure `out/` directory exists |
| Tools not working | Check Appium server is running, device is connected |

**See**: [VERIFICATION.md](./VERIFICATION.md) for detailed troubleshooting

---

## Documentation

- **[README.md](./README.md)** - Overview and features
- **[VERIFICATION.md](./VERIFICATION.md)** - How to verify everything works
- **[PACKAGING.md](./PACKAGING.md)** - Create and distribute VSIX files
- **[USAGE.md](./USAGE.md)** - Examples of using tools with AI agents

---

## Example: Test the Extension

1. **Start Appium**:
   ```bash
   appium --port 4723
   ```

2. **Connect Device**:
   ```bash
   adb devices
   # Should show your device/emulator
   ```

3. **Ask Copilot**:
   ```
   Can you use the Appium tools to:
   1. Start a session with my Android device
   2. Take a screenshot
   3. Get the page source
   4. Stop the session
   ```

4. **Check Artifacts**:
   - Screenshots: `.appium-artifacts/screenshots/`
   - Page sources: `.appium-artifacts/source/`

---

## Next Steps

- ✅ Extension installed and verified
- ✅ Tools visible in Copilot
- → Set up Appium server and device
- → Try automation examples from [USAGE.md](./USAGE.md)
- → Share VSIX with your team
- → Contribute improvements to the project

For complete documentation, see the main [README.md](./README.md).
