/**
 * Type Text Tool - Types text into an element
 */

import { sessionStore } from '../core/sessionStore';
import { wdRequest } from '../core/webdriverClient';

export async function typeText(elementId: string, text: string): Promise<string> {
  try {
    if (!sessionStore.hasActiveSession()) {
      return `Error: No active Appium session. Please start a session first using appium_startSession.`;
    }

    const serverUrl = sessionStore.getServerUrl();
    const sessionId = sessionStore.getSessionId();

    if (!serverUrl || !sessionId) {
      return `Error: No active Appium session`;
    }

    // Prepare text as array of characters (W3C format)
    const valueArray = text.split('');

    // Make POST request to send keys
    const url = `${serverUrl}/session/${sessionId}/element/${elementId}/value`;
    const body = {
      text,
      value: valueArray
    };
    await wdRequest('POST', url, body);

    return `Typed text successfully.\nElement ID: ${elementId}\nText: "${text}"`;
  } catch (error) {
    if (error instanceof Error) {
      return `Error typing text: ${error.message}`;
    }
    return `Error typing text: Unknown error`;
  }
}
