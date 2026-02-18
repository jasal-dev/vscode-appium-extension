/**
 * Tap Tool - Taps an element or coordinates
 */

import { sessionStore } from '../core/sessionStore';
import { wdRequest } from '../core/webdriverClient';

export async function tap(elementId?: string, x?: number, y?: number): Promise<string> {
  try {
    if (!sessionStore.hasActiveSession()) {
      return `Error: No active Appium session. Please start a session first using appium_startSession.`;
    }

    const serverUrl = sessionStore.getServerUrl();
    const sessionId = sessionStore.getSessionId();

    if (!serverUrl || !sessionId) {
      return `Error: No active Appium session`;
    }

    // Tap by element ID
    if (elementId) {
      const url = `${serverUrl}/session/${sessionId}/element/${elementId}/click`;
      await wdRequest('POST', url, {});
      return `Tapped element successfully.\nElement ID: ${elementId}`;
    }

    // Tap by coordinates
    if (x !== undefined && y !== undefined) {
      const url = `${serverUrl}/session/${sessionId}/actions`;
      const body = {
        actions: [
          {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
              { type: 'pointerMove', duration: 0, x, y },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 100 },
              { type: 'pointerUp', button: 0 }
            ]
          }
        ]
      };
      await wdRequest('POST', url, body);
      return `Tapped coordinates successfully.\nX: ${x}, Y: ${y}`;
    }

    return `Error: Either elementId or both x and y coordinates must be provided`;
  } catch (error) {
    if (error instanceof Error) {
      return `Error tapping: ${error.message}`;
    }
    return `Error tapping: Unknown error`;
  }
}
