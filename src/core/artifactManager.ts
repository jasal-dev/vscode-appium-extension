/**
 * Artifact Manager - Manages screenshots and page source files in workspace
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ArtifactManager {
  private artifactDir: string | null = null;

  /**
   * Initialize artifact directory in workspace
   */
  private ensureArtifactDir(): string {
    if (this.artifactDir) {
      return this.artifactDir;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error('No workspace folder open');
    }

    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    this.artifactDir = path.join(workspaceRoot, '.appium-artifacts');

    // Create main directory
    if (!fs.existsSync(this.artifactDir)) {
      fs.mkdirSync(this.artifactDir, { recursive: true });
    }

    // Create subdirectories
    const screenshotsDir = path.join(this.artifactDir, 'screenshots');
    const sourceDir = path.join(this.artifactDir, 'source');

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    if (!fs.existsSync(sourceDir)) {
      fs.mkdirSync(sourceDir, { recursive: true });
    }

    return this.artifactDir;
  }

  /**
   * Save screenshot from base64 PNG data
   * @param base64Data Base64 encoded PNG data
   * @returns Absolute file path
   */
  saveScreenshot(base64Data: string): string {
    const artifactDir = this.ensureArtifactDir();
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const filename = `screenshot-${timestamp}.png`;
    const filepath = path.join(artifactDir, 'screenshots', filename);

    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filepath, buffer);

    return filepath;
  }

  /**
   * Save page source XML
   * @param xmlContent XML content
   * @returns Absolute file path
   */
  savePageSource(xmlContent: string): string {
    const artifactDir = this.ensureArtifactDir();
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const filename = `source-${timestamp}.xml`;
    const filepath = path.join(artifactDir, 'source', filename);

    fs.writeFileSync(filepath, xmlContent, 'utf8');

    return filepath;
  }
}

// Export singleton instance
export const artifactManager = new ArtifactManager();
