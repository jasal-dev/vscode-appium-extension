# Project: VS Code Copilot Agent Tools for Android Appium (Raw WebDriver HTTP)

## 1. Objective

Implement a VS Code extension that exposes AI-callable tools for controlling an Android device via Appium using raw WebDriver HTTP (no client SDK, no MCP server).

The extension must provide a stable MVP toolset that GitHub Copilot Agent (or other LM tool-enabled agents in VS Code) can invoke through structured tool calling.

Primary use case:
- Connect to Android device/emulator
- Inspect UI (page source + screenshot)
- Find elements
- Tap/click elements
- Type text into inputs

This specification is intentionally AI-friendly and deterministic so an AI agent can implement the MVP end-to-end with minimal ambiguity.

---

# 2. High-Level Architecture

## 2.1 Components

1. VS Code Extension (TypeScript)
   - Registers Language Model Tools
   - Maintains session state (serverUrl, sessionId)
   - Handles filesystem artifacts (screenshots, sources)

2. Appium Server (external, already running)
   - Default: http://127.0.0.1:4723
   - Automation: UiAutomator2 (Android)

3. Android Device/Emulator
   - Connected via ADB
   - Managed by Appium

4. Raw WebDriver HTTP Layer
   - Direct HTTP requests to Appium endpoints
   - No Appium client libraries

---

# 3. Technology Constraints (MUST FOLLOW)

- Language: TypeScript
- Runtime: Node (VS Code Extension Host)
- Protocol: W3C WebDriver HTTP
- Platform: Android ONLY
- No Appium client SDK
- No MCP server
- No Python dependency
- Stateless HTTP wrapper + in-memory session state

---

# 4. Repository Structure (Target)

```
appium-agent-tools/
├── package.json
├── tsconfig.json
├── src/
│   ├── extension.ts
│   ├── tools/
│   │   ├── startSession.ts
│   │   ├── stopSession.ts
│   │   ├── findElement.ts
│   │   ├── tap.ts
│   │   ├── typeText.ts
│   │   ├── screenshot.ts
│   │   └── pageSource.ts
│   ├── core/
│   │   ├── webdriverClient.ts
│   │   ├── sessionStore.ts
│   │   └── artifactManager.ts
└── .vscode/
```

---

# 5. MVP Tool Set (REQUIRED)

The extension MUST implement exactly these 7 AI tools:

1. appium_startSession
2. appium_stopSession
3. appium_findElement
4. appium_tap
5. appium_typeText
6. appium_screenshot
7. appium_pageSource

Each tool must be registered using:
- vscode.lm.registerTool()
- contributes.languageModelTools in package.json

---

# 6. Global State Management

## 6.1 Session Store (In-Memory Singleton)

The extension MUST maintain:

```ts
interface SessionState {
  serverUrl: string | null;
  sessionId: string | null;
  capabilities?: object;
}
```

Rules:
- Only ONE active session at a time (MVP simplification)
- Stored in memory
- Reset on extension reload

---

# 7. WebDriver HTTP Specification (Core Implementation)

## 7.1 Base URL

```
{serverUrl}/session/{sessionId}
```

Example:
```
http://127.0.0.1:4723/session/abc123/element
```

## 7.2 Element ID Key (W3C)

MUST support:
- "element-6066-11e4-a52e-4f735466cecf" (primary)
- "ELEMENT" (fallback)

---

# 8. Tool Definitions (AI-CALLABLE CONTRACT)

## 8.1 Tool: appium_startSession

### Description
Start a new Android Appium session.

### Input Schema
```json
{
  "type": "object",
  "properties": {
    "serverUrl": { "type": "string" },
    "capabilities": { "type": "object" }
  },
  "required": ["serverUrl", "capabilities"]
}
```

### HTTP Call
POST /session

Body:
```
{
  "capabilities": {
    "alwaysMatch": {
      "platformName": "Android",
      "appium:automationName": "UiAutomator2"
    }
  }
}
```

### Output
- sessionId
- serverUrl

---

## 8.2 Tool: appium_stopSession

### Description
Terminate the active Appium session.

### HTTP Call
DELETE /session/{sessionId}

### Behavior
- Clear session store
- Return success message

---

## 8.3 Tool: appium_findElement

### Description
Find a UI element using a locator strategy.

### Input Schema
```json
{
  "type": "object",
  "properties": {
    "using": { "type": "string" },
    "value": { "type": "string" }
  },
  "required": ["using", "value"]
}
```

### Supported Strategies (MVP)
- id
- xpath
- accessibility id
- class name

### HTTP Call
POST /session/{sessionId}/element

### Output
- elementId (W3C format)

---

## 8.4 Tool: appium_tap

### Description
Tap an element or screen coordinates.

### Input Schema
```json
{
  "oneOf": [
    { "required": ["elementId"] },
    { "required": ["x", "y"] }
  ]
}
```

### Behavior
IF elementId:
POST /session/{sessionId}/element/{elementId}/click

IF coordinates:
Use W3C Actions API (pointer tap)

---

## 8.5 Tool: appium_typeText

### Description
Type text into a focused or specified element.

### Input Schema
```json
{
  "type": "object",
  "properties": {
    "elementId": { "type": "string" },
    "text": { "type": "string" }
  },
  "required": ["elementId", "text"]
}
```

### HTTP Call
POST /session/{sessionId}/element/{elementId}/value

Body:
```
{
  "text": "hello",
  "value": ["h","e","l","l","o"]
}
```

---

## 8.6 Tool: appium_screenshot

### Description
Capture device screenshot and save to workspace.

### HTTP Call
GET /session/{sessionId}/screenshot

### Behavior
- Decode base64 PNG
- Save to: `.appium-artifacts/screenshots/{timestamp}.png`
- Return file path

---

## 8.7 Tool: appium_pageSource

### Description
Retrieve current UI hierarchy XML.

### HTTP Call
GET /session/{sessionId}/source

### Behavior
- Save XML to: `.appium-artifacts/source/{timestamp}.xml`
- Return XML string OR file path (prefer file path if > 100KB)

---

# 9. Core Modules to Implement

## 9.1 webdriverClient.ts (CRITICAL)
Responsibilities:
- HTTP fetch wrapper
- JSON parsing
- Error normalization
- Timeout support (10–30s)

Function:
```
async function wdRequest(method, url, body?)
```

---

## 9.2 artifactManager.ts
Responsibilities:
- Create `.appium-artifacts/`
- Manage screenshots
- Manage XML dumps
- Ensure workspace-relative paths

---

## 9.3 extension.ts
Responsibilities:
- Activate extension
- Register all 7 tools
- Wire tools to core modules

---

# 10. AI-Agent Optimization Rules (IMPORTANT)

1. Tools MUST return clear structured text
2. Always include:
   - sessionId (when relevant)
   - elementId (when found)
   - artifact file paths
3. Never return raw binary
4. Use deterministic error messages:
   - "No active Appium session"
   - "Element not found"
5. Do NOT throw unhandled exceptions
6. All tools must be idempotent-safe where possible

---

# 11. Error Handling Requirements

Must handle:
- Appium server offline
- Invalid session
- Element not found
- Timeout
- Malformed responses

Return AI-friendly messages instead of stack traces.

---

# 12. Security & Safety (MVP)

- Only enable tools in trusted workspace
- Confirm destructive actions (tap/type) via prepareInvocation
- No external network except Appium server URL

---

# 13. Implementation Task Breakdown (FOR AI AGENT)

## Phase 1 — Project Setup
- [ ] Initialize VS Code extension (TypeScript)
- [ ] Configure tsconfig
- [ ] Add vscode engine compatibility

## Phase 2 — Core Infrastructure
- [ ] Implement sessionStore singleton
- [ ] Implement webdriverClient HTTP wrapper
- [ ] Implement artifactManager filesystem logic

## Phase 3 — Tool Registration
- [ ] Define languageModelTools in package.json
- [ ] Register tools in extension.ts

## Phase 4 — Tool Implementations
- [ ] startSession tool
- [ ] stopSession tool
- [ ] findElement tool
- [ ] tap tool
- [ ] typeText tool
- [ ] screenshot tool
- [ ] pageSource tool

## Phase 5 — Validation
- [ ] Test with local Appium server
- [ ] Test on Android emulator
- [ ] Validate Copilot Agent tool invocation

---

# 14. Definition of Done (MVP)

The MVP is complete when:
- Copilot Agent can start a session
- Agent can inspect UI via screenshot + source
- Agent can find elements
- Agent can tap and type text
- All 7 tools execute via raw WebDriver HTTP successfully
- No Appium client libraries are used

---

# 15. Future (Out of Scope for MVP)

- Multi-device sessions
- iOS support
- Gesture actions (swipe, pinch)
- Element caching layer
- Visual element detection
- Parallel sessions

