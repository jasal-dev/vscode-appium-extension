/**
 * Swipe Tool - Performs vertical swipe gestures (up or down)
 */

import { sessionStore } from '../core/sessionStore';
import { wdRequest } from '../core/webdriverClient';

type SwipeDirection = 'up' | 'down';

export async function swipe(direction: SwipeDirection, duration: number = 400): Promise<string> {
  try {
    if (!sessionStore.hasActiveSession()) {
      return `Error: No active Appium session. Please start a session first using appium_startSession.`;
    }

    const serverUrl = sessionStore.getServerUrl();
    const sessionId = sessionStore.getSessionId();

    if (!serverUrl || !sessionId) {
      return `Error: No active Appium session`;
    }

    if (direction !== 'up' && direction !== 'down') {
      return `Error: direction must be either 'up' or 'down'`;
    }

    if (!Number.isFinite(duration) || duration < 100 || duration > 3000) {
      return `Error: duration must be between 100 and 3000 milliseconds`;
    }

    const rectUrl = `${serverUrl}/session/${sessionId}/window/rect`;
    const rectResponse = await wdRequest('GET', rectUrl);
    const rect = rectResponse.value;

    const width = Number(rect.width);
    const height = Number(rect.height);

    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return `Error: Unable to determine screen size for swipe`;
    }

    const x = Math.round(width * 0.5);
    const startY = direction === 'up' ? Math.round(height * 0.8) : Math.round(height * 0.2);
    const endY = direction === 'up' ? Math.round(height * 0.2) : Math.round(height * 0.8);

    const actionsUrl = `${serverUrl}/session/${sessionId}/actions`;
    const body = {
      actions: [
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x, y: startY },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerMove', duration, x, y: endY },
            { type: 'pointerUp', button: 0 }
          ]
        }
      ]
    };

    await wdRequest('POST', actionsUrl, body);

    return `Swipe ${direction} executed successfully.\nStart: (${x}, ${startY})\nEnd: (${x}, ${endY})\nDuration: ${duration}ms`;
  } catch (error) {
    if (error instanceof Error) {
      return `Error swiping: ${error.message}`;
    }
    return `Error swiping: Unknown error`;
  }
}
