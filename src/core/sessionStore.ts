/**
 * Session Store - In-memory singleton for managing Appium session state
 */

interface SessionState {
  serverUrl: string | null;
  sessionId: string | null;
  capabilities?: object;
}

class SessionStore {
  private state: SessionState = {
    serverUrl: null,
    sessionId: null,
    capabilities: undefined
  };

  getState(): SessionState {
    return { ...this.state };
  }

  setSession(serverUrl: string, sessionId: string, capabilities?: object): void {
    this.state = {
      serverUrl,
      sessionId,
      capabilities
    };
  }

  clearSession(): void {
    this.state = {
      serverUrl: null,
      sessionId: null,
      capabilities: undefined
    };
  }

  hasActiveSession(): boolean {
    return this.state.sessionId !== null && this.state.serverUrl !== null;
  }

  getSessionId(): string | null {
    return this.state.sessionId;
  }

  getServerUrl(): string | null {
    return this.state.serverUrl;
  }
}

// Export singleton instance
export const sessionStore = new SessionStore();
