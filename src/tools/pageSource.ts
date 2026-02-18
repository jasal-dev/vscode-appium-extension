/**
 * Page Source Tool - Retrieves UI hierarchy XML
 */

import { sessionStore } from '../core/sessionStore';
import { wdRequest } from '../core/webdriverClient';
import { artifactManager } from '../core/artifactManager';

export async function pageSource(): Promise<string> {
  try {
    if (!sessionStore.hasActiveSession()) {
      return `Error: No active Appium session. Please start a session first using appium_startSession.`;
    }

    const serverUrl = sessionStore.getServerUrl();
    const sessionId = sessionStore.getSessionId();

    if (!serverUrl || !sessionId) {
      return `Error: No active Appium session`;
    }

    // Make GET request to get page source
    const url = `${serverUrl}/session/${sessionId}/source`;
    const response = await wdRequest('GET', url);

    const xmlContent = response.value;
    if (!xmlContent) {
      return `Error: No page source returned`;
    }

    // Save page source to workspace (always save to file for large XML)
    const filepath = artifactManager.savePageSource(xmlContent);

    // If content is small (< 100KB), also return it inline
    const sizeKB = Buffer.byteLength(xmlContent, 'utf8') / 1024;
    if (sizeKB < 100) {
      return `Page source retrieved successfully.\nFile path: ${filepath}\n\nContent:\n${xmlContent}`;
    }

    return `Page source retrieved successfully.\nFile path: ${filepath}\nSize: ${sizeKB.toFixed(2)} KB`;
  } catch (error) {
    if (error instanceof Error) {
      return `Error retrieving page source: ${error.message}`;
    }
    return `Error retrieving page source: Unknown error`;
  }
}
