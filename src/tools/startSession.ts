/**
 * Start Session Tool - Initiates a new Appium session
 */

import { sessionStore } from '../core/sessionStore';
import { wdRequest } from '../core/webdriverClient';

export async function startSession(serverUrl: string, capabilities: any): Promise<string> {
  try {
    // Check if there's already an active session
    if (sessionStore.hasActiveSession()) {
      return `Error: An active session already exists. Please stop it first using appium_stopSession.`;
    }

    // Prepare W3C capabilities format
    const body = {
      capabilities: {
        alwaysMatch: {
          platformName: capabilities.platformName || 'Android',
          'appium:automationName': capabilities['appium:automationName'] || capabilities.automationName || 'UiAutomator2',
          ...capabilities
        }
      }
    };

    // Make POST request to create session
    const url = `${serverUrl}/session`;
    const response = await wdRequest('POST', url, body);

    const sessionId = response.sessionId || response.value?.sessionId;
    if (!sessionId) {
      return `Error: Failed to create session - no sessionId returned`;
    }

    // Store session state
    sessionStore.setSession(serverUrl, sessionId, capabilities);

    return `Session started successfully.\nSession ID: ${sessionId}\nServer URL: ${serverUrl}`;
  } catch (error) {
    if (error instanceof Error) {
      return `Error starting session: ${error.message}`;
    }
    return `Error starting session: Unknown error`;
  }
}
