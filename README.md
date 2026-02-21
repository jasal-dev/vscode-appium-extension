# Appium Agent Tools for VS Code

A VS Code extension that exposes AI-callable tools for controlling Android devices via Appium using raw WebDriver HTTP protocol.

## Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute quick start guide
- **[FAQ.md](./FAQ.md)** - Answers to common questions (verification, packaging, running without debug)
- **[VERIFICATION.md](./VERIFICATION.md)** - How to verify the extension is working and see tools in GitHub Copilot
- **[PACKAGING.md](./PACKAGING.md)** - How to create VSIX packages and install on other machines
- **[USAGE.md](./USAGE.md)** - Detailed examples of using the tools with AI agents
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details

## Features

This extension provides 8 Language Model Tools that GitHub Copilot Agent and other AI agents can invoke:

1. **appium_startSession** - Start a new Android Appium session
2. **appium_stopSession** - Terminate the active Appium session
3. **appium_findElement** - Find UI elements using locator strategies
4. **appium_tap** - Tap elements or screen coordinates
5. **appium_typeText** - Type text into input elements
6. **appium_swipe** - Swipe up or down on screen
7. **appium_screenshot** - Capture device screenshots
8. **appium_pageSource** - Retrieve UI hierarchy XML

## Prerequisites

- VS Code 1.90.0 or higher
- Appium server running (default: http://127.0.0.1:4723)
- Android device or emulator connected via ADB
- Node.js and npm installed

## Installation

### From Source (Development)

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the extension:
   ```bash
   npm run compile
   ```
4. Press F5 in VS Code to launch the extension in debug mode

For detailed verification steps, see **[VERIFICATION.md](./VERIFICATION.md)**.

### From VSIX Package (Production)

To install the extension on other machines or run without debug mode:

1. Create a distributable package:
   ```bash
   npm run package
   ```
   This creates `appium-agent-tools-0.1.0.vsix`

2. Install the VSIX file:
   - Open VS Code
   - Go to Extensions (`Ctrl+Shift+X`)
   - Click "..." → "Install from VSIX..."
   - Select the `.vsix` file

For complete packaging and installation instructions, see **[PACKAGING.md](./PACKAGING.md)**.

## Usage

The tools are designed to be invoked by AI agents like GitHub Copilot. Once the extension is activated, AI agents can use these tools to automate Android testing workflows.

### Verifying the Extension is Working

After launching the extension (F5) or installing from VSIX:

1. **Check Extension Status**:
   - Press `Ctrl+Shift+P` → `Developer: Show Running Extensions`
   - Look for "Appium Agent Tools" with status **Active**

2. **View Tools in Agent Configuration** (New!):
   - Open GitHub Copilot Chat (`Ctrl+Shift+I`)
   - Click the settings gear icon (⚙️) in the chat panel
   - Look for "Tools" or "Agent Tools" section
   - You'll see all 8 Appium tools with their display names and tags
   - Enable/disable individual tools as needed

3. **Check GitHub Copilot Integration**:
   - Open GitHub Copilot Chat (`Ctrl+Shift+I`)
   - Ask: "What Appium tools do you have available?"
   - You should see the 8 Appium tools listed

4. **View Tools in Copilot**:
   The following tools will be available to AI agents:
   - `appium_startSession` - Start Appium Session (tags: appium, mobile, testing, android, automation)
   - `appium_stopSession` - Stop Appium Session (tags: appium, mobile, testing, android, automation)
   - `appium_findElement` - Find UI Element (tags: appium, mobile, testing, android, automation, ui)
   - `appium_tap` - Tap Element or Coordinates (tags: appium, mobile, testing, android, automation, interaction)
   - `appium_typeText` - Type Text (tags: appium, mobile, testing, android, automation, interaction, input)
   - `appium_swipe` - Swipe Up or Down (tags: appium, mobile, testing, android, automation, interaction, gesture)
   - `appium_screenshot` - Capture Screenshot (tags: appium, mobile, testing, android, automation, debug, screenshot)
   - `appium_pageSource` - Get Page Source (tags: appium, mobile, testing, android, automation, debug, ui)

For detailed verification instructions, troubleshooting, and testing, see **[VERIFICATION.md](./VERIFICATION.md)**.

### Example Workflow

1. **Start Session**: Connect to Appium server and start a session
2. **Inspect UI**: Capture screenshot and get page source
3. **Find Element**: Locate UI elements using xpath, id, or accessibility id
4. **Interact**: Tap elements and type text
5. **Stop Session**: Clean up and close the session

### Artifacts

The extension saves artifacts in the workspace:
- Screenshots: `.appium-artifacts/screenshots/`
- Page sources: `.appium-artifacts/source/`

## Architecture

### Core Modules

- **sessionStore.ts** - In-memory singleton for session state management
- **webdriverClient.ts** - HTTP wrapper for W3C WebDriver protocol
- **artifactManager.ts** - File system management for screenshots and XML

### Tool Implementations

Each tool is implemented in `src/tools/` and follows a consistent pattern:
- Validates active session (except startSession)
- Makes WebDriver HTTP requests
- Returns AI-friendly text responses
- Handles errors gracefully

## Technology Stack

- **Language**: TypeScript
- **Runtime**: VS Code Extension Host (Node.js)
- **Protocol**: W3C WebDriver HTTP (raw, no client SDK)
- **Platform**: Android only (MVP)
- **Automation**: UiAutomator2

## Development

### Build

```bash
npm run compile
```

### Watch Mode

```bash
npm run watch
```

### Publish Release (GitHub Actions)

This repository includes a manual workflow to package and publish a release with a VSIX asset.

1. Open GitHub → **Actions** → **Publish Release**.
2. Click **Run workflow**.
3. Provide:
   - `tag` (required, example: `v0.1.0`)
   - `release_name` (optional)
   - `prerelease` (optional)
4. Run the workflow.

The workflow compiles the extension, builds the `.vsix`, and creates a GitHub Release with the VSIX attached.
Users can then download new versions from the repository **Releases** page.

## Configuration

The extension uses default Appium server URL: `http://127.0.0.1:4723`

You can specify a different URL when starting a session through the AI agent.

## Limitations (MVP)

- Single session at a time
- Android only
- No iOS support
- No advanced multi-touch gestures (pinch, zoom)
- In-memory session state (lost on extension reload)

## License

MIT