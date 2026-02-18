/**
 * Find Element Tool - Locates a UI element
 */

import { sessionStore } from '../core/sessionStore';
import { wdRequest, extractElementId } from '../core/webdriverClient';

export async function findElement(using: string, value: string): Promise<string> {
  try {
    if (!sessionStore.hasActiveSession()) {
      return `Error: No active Appium session. Please start a session first using appium_startSession.`;
    }

    const serverUrl = sessionStore.getServerUrl();
    const sessionId = sessionStore.getSessionId();

    if (!serverUrl || !sessionId) {
      return `Error: No active Appium session`;
    }

    // Validate locator strategy
    const validStrategies = ['id', 'xpath', 'accessibility id', 'class name'];
    if (!validStrategies.includes(using)) {
      return `Error: Invalid locator strategy '${using}'. Valid strategies: ${validStrategies.join(', ')}`;
    }

    // Make POST request to find element
    const url = `${serverUrl}/session/${sessionId}/element`;
    const body = { using, value };
    const response = await wdRequest('POST', url, body);

    // Extract element ID from response
    const elementId = extractElementId(response.value);

    return `Element found.\nElement ID: ${elementId}\nLocator: ${using}=${value}`;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('no such element')) {
        return `Element not found using ${using}=${value}`;
      }
      return `Error finding element: ${error.message}`;
    }
    return `Error finding element: Unknown error`;
  }
}
