/**
 * VS Code Extension Entry Point
 * Registers Language Model Tools for Appium automation
 */

import * as vscode from 'vscode';
import { startSession } from './tools/startSession';
import { stopSession } from './tools/stopSession';
import { findElement } from './tools/findElement';
import { tap } from './tools/tap';
import { typeText } from './tools/typeText';
import { screenshot } from './tools/screenshot';
import { pageSource } from './tools/pageSource';

export function activate(context: vscode.ExtensionContext) {
  console.log('Appium Agent Tools extension is now active');

  // Register appium_startSession tool
  const startSessionTool = vscode.lm.registerTool('appium_startSession', {
    invoke: async (
      options: vscode.LanguageModelToolInvocationOptions<{
        serverUrl: string;
        capabilities: any;
      }>,
      _token: vscode.CancellationToken
    ) => {
      const { serverUrl, capabilities } = options.input;
      const result = await startSession(serverUrl, capabilities);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(result)
      ]);
    }
  });
  context.subscriptions.push(startSessionTool);

  // Register appium_stopSession tool
  const stopSessionTool = vscode.lm.registerTool('appium_stopSession', {
    invoke: async (
      _options: vscode.LanguageModelToolInvocationOptions<{}>,
      _token: vscode.CancellationToken
    ) => {
      const result = await stopSession();
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(result)
      ]);
    }
  });
  context.subscriptions.push(stopSessionTool);

  // Register appium_findElement tool
  const findElementTool = vscode.lm.registerTool('appium_findElement', {
    invoke: async (
      options: vscode.LanguageModelToolInvocationOptions<{
        using: string;
        value: string;
      }>,
      _token: vscode.CancellationToken
    ) => {
      const { using, value } = options.input;
      const result = await findElement(using, value);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(result)
      ]);
    }
  });
  context.subscriptions.push(findElementTool);

  // Register appium_tap tool
  const tapTool = vscode.lm.registerTool('appium_tap', {
    invoke: async (
      options: vscode.LanguageModelToolInvocationOptions<{
        elementId?: string;
        x?: number;
        y?: number;
      }>,
      _token: vscode.CancellationToken
    ) => {
      const { elementId, x, y } = options.input;
      const result = await tap(elementId, x, y);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(result)
      ]);
    }
  });
  context.subscriptions.push(tapTool);

  // Register appium_typeText tool
  const typeTextTool = vscode.lm.registerTool('appium_typeText', {
    invoke: async (
      options: vscode.LanguageModelToolInvocationOptions<{
        elementId: string;
        text: string;
      }>,
      _token: vscode.CancellationToken
    ) => {
      const { elementId, text } = options.input;
      const result = await typeText(elementId, text);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(result)
      ]);
    }
  });
  context.subscriptions.push(typeTextTool);

  // Register appium_screenshot tool
  const screenshotTool = vscode.lm.registerTool('appium_screenshot', {
    invoke: async (
      _options: vscode.LanguageModelToolInvocationOptions<{}>,
      _token: vscode.CancellationToken
    ) => {
      const result = await screenshot();
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(result)
      ]);
    }
  });
  context.subscriptions.push(screenshotTool);

  // Register appium_pageSource tool
  const pageSourceTool = vscode.lm.registerTool('appium_pageSource', {
    invoke: async (
      _options: vscode.LanguageModelToolInvocationOptions<{}>,
      _token: vscode.CancellationToken
    ) => {
      const result = await pageSource();
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(result)
      ]);
    }
  });
  context.subscriptions.push(pageSourceTool);

  console.log('All 7 Appium tools registered successfully');
}

export function deactivate() {
  console.log('Appium Agent Tools extension is now deactivated');
}
