/**
 * Stop Session Tool - Terminates the active Appium session
 */

import { sessionStore } from '../core/sessionStore';
import { wdRequest } from '../core/webdriverClient';

export async function stopSession(): Promise<string> {
  try {
    if (!sessionStore.hasActiveSession()) {
      return `No active Appium session`;
    }

    const serverUrl = sessionStore.getServerUrl();
    const sessionId = sessionStore.getSessionId();

    if (!serverUrl || !sessionId) {
      sessionStore.clearSession();
      return `No active Appium session`;
    }

    // Make DELETE request to stop session
    const url = `${serverUrl}/session/${sessionId}`;
    try {
      await wdRequest('DELETE', url);
    } catch (error) {
      // Even if the request fails, clear local session state
      console.error('Error stopping session:', error);
    }

    // Clear session state
    sessionStore.clearSession();

    return `Session stopped successfully.`;
  } catch (error) {
    // Always clear session state on stop attempt
    sessionStore.clearSession();
    
    if (error instanceof Error) {
      return `Session stopped (with warning: ${error.message})`;
    }
    return `Session stopped`;
  }
}
