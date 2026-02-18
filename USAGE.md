# Appium Agent Tools - Usage Examples

This document provides examples of how AI agents can use the Appium Agent Tools to automate Android testing.

## Prerequisites

1. **Start Appium Server**:
   ```bash
   appium --port 4723
   ```

2. **Connect Android Device/Emulator**:
   ```bash
   adb devices
   ```

3. **Open VS Code** with this extension installed and activated.

## Example 1: Simple Session Test

```
AI Agent Workflow:
1. Start session with default capabilities
2. Take a screenshot
3. Get page source
4. Stop session
```

**Tool Calls**:

```json
// 1. Start Session
appium_startSession({
  "serverUrl": "http://127.0.0.1:4723",
  "capabilities": {
    "platformName": "Android",
    "appium:automationName": "UiAutomator2",
    "appium:deviceName": "Android Emulator",
    "appium:appPackage": "com.android.settings",
    "appium:appActivity": ".Settings"
  }
})

// 2. Capture Screenshot
appium_screenshot()

// 3. Get Page Source
appium_pageSource()

// 4. Stop Session
appium_stopSession()
```

## Example 2: Element Interaction

```
AI Agent Workflow:
1. Start session with an app
2. Find a button element
3. Tap the button
4. Find a text input
5. Type text into input
6. Take screenshot to verify
7. Stop session
```

**Tool Calls**:

```json
// 1. Start Session
appium_startSession({
  "serverUrl": "http://127.0.0.1:4723",
  "capabilities": {
    "platformName": "Android",
    "appium:automationName": "UiAutomator2",
    "appium:deviceName": "Android Emulator"
  }
})

// 2. Find Element by ID
appium_findElement({
  "using": "id",
  "value": "com.example.app:id/login_button"
})
// Returns: Element ID: abc123...

// 3. Tap Element
appium_tap({
  "elementId": "abc123..."
})

// 4. Find Text Input
appium_findElement({
  "using": "accessibility id",
  "value": "username_input"
})
// Returns: Element ID: def456...

// 5. Type Text
appium_typeText({
  "elementId": "def456...",
  "text": "testuser"
})

// 6. Screenshot
appium_screenshot()

// 7. Stop Session
appium_stopSession()
```

## Example 3: Using XPath Locators

```json
// Find element by XPath
appium_findElement({
  "using": "xpath",
  "value": "//android.widget.Button[@text='Submit']"
})

// Find element by class name
appium_findElement({
  "using": "class name",
  "value": "android.widget.EditText"
})
```

## Example 4: Coordinate-based Tap

```json
// Tap at specific coordinates (x, y)
appium_tap({
  "x": 500,
  "y": 1000
})
```

## Locator Strategies

The extension supports these locator strategies:

1. **id**: Find by resource ID
   - Example: `com.example.app:id/button_submit`

2. **xpath**: Find by XPath expression
   - Example: `//android.widget.Button[@text='Login']`

3. **accessibility id**: Find by accessibility identifier
   - Example: `login_button`

4. **class name**: Find by Android widget class
   - Example: `android.widget.EditText`

## Error Handling

The tools return AI-friendly error messages:

- `"No active Appium session"` - Need to start a session first
- `"Element not found"` - Element doesn't exist with given locator
- `"Error starting session: ..."` - Server connection or capability issues
- `"Request timeout"` - Operation took too long (>30s)

## Artifacts Location

All generated artifacts are saved in your workspace:

- **Screenshots**: `.appium-artifacts/screenshots/screenshot-{timestamp}.png`
- **Page Sources**: `.appium-artifacts/source/source-{timestamp}.xml`

The file paths are returned in tool responses for easy reference.

## Tips for AI Agents

1. Always check if a session is active before other operations
2. Use `appium_pageSource()` to inspect UI hierarchy and find element locators
3. Use `appium_screenshot()` to visually verify application state
4. Extract element IDs from `appium_findElement()` responses for use in tap/typeText
5. Always call `appium_stopSession()` when done to clean up resources
6. If an operation fails, check the error message for guidance

## Session Capabilities

Common Android capabilities:

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "device_name",
  "appium:udid": "emulator-5554",
  "appium:appPackage": "com.example.app",
  "appium:appActivity": ".MainActivity",
  "appium:noReset": true,
  "appium:fullReset": false
}
```

## Troubleshooting

### Session Won't Start
- Verify Appium server is running on the specified URL
- Check that device/emulator is connected: `adb devices`
- Verify app package and activity names are correct

### Element Not Found
- Use `appium_pageSource()` to inspect UI hierarchy
- Try different locator strategies (id, xpath, accessibility id)
- Wait for UI to load before finding elements

### Timeout Errors
- Default timeout is 30 seconds
- Some operations may need the device to be responsive
- Check device performance and Appium server logs
