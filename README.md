# Appium Agent Tools for VS Code

A VS Code extension that exposes AI-callable tools for controlling Android devices via Appium using raw WebDriver HTTP protocol.

## Features

This extension provides 7 Language Model Tools that GitHub Copilot Agent and other AI agents can invoke:

1. **appium_startSession** - Start a new Android Appium session
2. **appium_stopSession** - Terminate the active Appium session
3. **appium_findElement** - Find UI elements using locator strategies
4. **appium_tap** - Tap elements or screen coordinates
5. **appium_typeText** - Type text into input elements
6. **appium_screenshot** - Capture device screenshots
7. **appium_pageSource** - Retrieve UI hierarchy XML

## Prerequisites

- VS Code 1.90.0 or higher
- Appium server running (default: http://127.0.0.1:4723)
- Android device or emulator connected via ADB
- Node.js and npm installed

## Installation

### From Source

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

## Usage

The tools are designed to be invoked by AI agents like GitHub Copilot. Once the extension is activated, AI agents can use these tools to automate Android testing workflows.

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

## Configuration

The extension uses default Appium server URL: `http://127.0.0.1:4723`

You can specify a different URL when starting a session through the AI agent.

## Limitations (MVP)

- Single session at a time
- Android only
- No iOS support
- No gesture actions (swipe, pinch)
- In-memory session state (lost on extension reload)

## License

MIT