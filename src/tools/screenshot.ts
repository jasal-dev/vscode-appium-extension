/**
 * Screenshot Tool - Captures device screenshot
 */

import { sessionStore } from '../core/sessionStore';
import { wdRequest } from '../core/webdriverClient';
import { artifactManager } from '../core/artifactManager';

export async function screenshot(): Promise<string> {
  try {
    if (!sessionStore.hasActiveSession()) {
      return `Error: No active Appium session. Please start a session first using appium_startSession.`;
    }

    const serverUrl = sessionStore.getServerUrl();
    const sessionId = sessionStore.getSessionId();

    if (!serverUrl || !sessionId) {
      return `Error: No active Appium session`;
    }

    // Make GET request to capture screenshot
    const url = `${serverUrl}/session/${sessionId}/screenshot`;
    const response = await wdRequest('GET', url);

    const base64Data = response.value;
    if (!base64Data) {
      return `Error: No screenshot data returned`;
    }

    // Save screenshot to workspace
    const filepath = artifactManager.saveScreenshot(base64Data);

    return `Screenshot captured successfully.\nFile path: ${filepath}`;
  } catch (error) {
    if (error instanceof Error) {
      return `Error capturing screenshot: ${error.message}`;
    }
    return `Error capturing screenshot: Unknown error`;
  }
}
