# Packaging and Installation Guide

This guide explains how to package the extension into a distributable VSIX file and install it on other machines.

## Table of Contents

1. [Creating a VSIX Package](#creating-a-vsix-package)
2. [Installing from VSIX](#installing-from-vsix)
3. [Running Without Debug Mode](#running-without-debug-mode)
4. [Distribution Options](#distribution-options)

---

## Creating a VSIX Package

A VSIX (Visual Studio Code Extension) file is a distributable package that can be installed on any VS Code instance without debug mode.

### Prerequisites

- Node.js and npm installed
- Extension compiled successfully

### Step-by-Step Instructions

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Compile the extension**:
   ```bash
   npm run compile
   ```

3. **Create the VSIX package**:
   ```bash
   npm run package
   ```

   This will create a file like: `appium-agent-tools-0.1.0.vsix`

### What Gets Packaged?

The VSIX file includes:
- Compiled JavaScript files from `out/` directory
- `package.json` with extension metadata
- README.md and other documentation
- Extension manifest and icons (if any)

**It does NOT include:**
- Source TypeScript files
- `node_modules/` (dependencies are bundled if needed)
- Development files like `.vscode/`, `.git/`

---

## Installing from VSIX

Once you have a `.vsix` file, you can install it on any machine.

### Method 1: Install via VS Code UI

1. **Open VS Code** on the target machine
2. Click the **Extensions** icon in the Activity Bar (or press `Ctrl+Shift+X`)
3. Click the **"..."** (More Actions) button at the top of the Extensions panel
4. Select **"Install from VSIX..."**
5. Navigate to and select the `.vsix` file
6. Click **"Install"**
7. Reload VS Code when prompted

### Method 2: Install via Command Line

```bash
code --install-extension appium-agent-tools-0.1.0.vsix
```

Or if you're using VS Code Insiders:

```bash
code-insiders --install-extension appium-agent-tools-0.1.0.vsix
```

### Method 3: Manual Installation

1. Copy the `.vsix` file to the target machine
2. Change the file extension from `.vsix` to `.zip`
3. Extract the contents
4. Copy the extracted folder to:
   - **Windows**: `%USERPROFILE%\.vscode\extensions\`
   - **macOS**: `~/.vscode/extensions/`
   - **Linux**: `~/.vscode/extensions/`
5. Restart VS Code

---

## Running Without Debug Mode

After installing from VSIX, the extension runs automatically in production mode (no debugging).

### Verifying Installation

1. **Open VS Code**
2. Press `Ctrl+Shift+X` to open Extensions
3. Search for "Appium Agent Tools"
4. You should see it in the **Installed** section

### Checking Extension Status

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: `Developer: Show Running Extensions`
3. Look for **"Appium Agent Tools"** with status: **Active**

### Using the Extension

Once installed, the extension provides its tools to GitHub Copilot and other AI agents automatically. You don't need to start it manually.

**The extension activates when**:
- VS Code starts (if previously used)
- A Language Model tool is requested
- GitHub Copilot attempts to use an Appium tool

### Viewing Extension Logs

If you need to debug issues in production mode:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: `Developer: Show Logs`
3. Select **Extension Host**
4. Look for entries related to "Appium Agent Tools"

---

## Distribution Options

### Option 1: Share VSIX File Directly

**Best for**: Small teams, internal use

1. Create the VSIX package (see above)
2. Share the `.vsix` file via:
   - Email
   - File sharing service (Dropbox, Google Drive, etc.)
   - Internal network drive
   - Git releases (GitHub/GitLab)

**Advantages**:
- Simple and quick
- No setup required
- Works offline

**Disadvantages**:
- Manual installation required
- No automatic updates

### Option 2: GitHub Releases

**Best for**: Open source projects, version tracking

1. Create a GitHub release
2. Upload the `.vsix` file as a release asset
3. Users can download from the releases page

**Steps**:
```bash
# Tag the release
git tag v0.1.0
git push origin v0.1.0

# Create release on GitHub with the VSIX file attached
```

### Option 3: Private Extension Repository

**Best for**: Enterprise environments

Set up a private extension gallery for your organization. See VS Code documentation for details.

### Option 4: VS Code Marketplace

**Best for**: Public distribution, wide audience

To publish to the official VS Code Marketplace:

1. Create a Microsoft account
2. Create a publisher account on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
3. Get a Personal Access Token (PAT) from Azure DevOps
4. Run:
   ```bash
   vsce login <publisher-name>
   npm run publish
   ```

**Note**: Publishing to the marketplace requires additional setup and review. See [VS Code Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) for details.

---

## Updating the Extension

### For Developers

1. Update the version in `package.json`:
   ```json
   "version": "0.2.0"
   ```

2. Rebuild and repackage:
   ```bash
   npm run compile
   npm run package
   ```

3. Distribute the new VSIX file

### For Users

1. Uninstall the old version (optional but recommended):
   - Go to Extensions (`Ctrl+Shift+X`)
   - Right-click "Appium Agent Tools"
   - Select "Uninstall"

2. Install the new VSIX file using any of the methods above

**Note**: Installing a newer version usually overwrites the old one automatically.

---

## Uninstalling the Extension

### Via VS Code UI

1. Open Extensions (`Ctrl+Shift+X`)
2. Find "Appium Agent Tools"
3. Click **Uninstall**
4. Reload VS Code

### Via Command Line

```bash
code --uninstall-extension appium-tools.appium-agent-tools
```

---

## Troubleshooting

### "Extension not found" after installation

**Solution**: Make sure VS Code is fully closed and reopened after installation.

### "Extension is not activated"

**Solution**: The extension activates automatically when tools are requested. Check activation events in the extension details.

### "VSIX package creation failed"

**Common causes**:
- Missing files in `out/` directory → Run `npm run compile`
- Invalid `package.json` → Check syntax and required fields
- Missing `vsce` → Run `npm install`

**Solution**:
```bash
npm install
npm run compile
npm run package
```

### Different behavior in debug vs. production

**Debug mode** (F5):
- Hot reload on code changes
- Detailed debug output
- Source maps enabled
- Runs in separate Extension Development Host

**Production mode** (installed VSIX):
- No hot reload
- Limited logging
- Optimized code
- Runs in main VS Code instance

---

## Quick Reference

### Common Commands

```bash
# Development
npm install              # Install dependencies
npm run compile          # Compile TypeScript
npm run watch           # Watch mode for development

# Packaging
npm run package         # Create VSIX file

# Publishing (requires setup)
npm run publish         # Publish to VS Code Marketplace

# Installation
code --install-extension appium-agent-tools-0.1.0.vsix
code --uninstall-extension appium-tools.appium-agent-tools
```

### File Locations

- **VSIX output**: `./appium-agent-tools-0.1.0.vsix`
- **Compiled code**: `./out/`
- **Extension folder** (after install):
  - Windows: `%USERPROFILE%\.vscode\extensions\appium-tools.appium-agent-tools-0.1.0\`
  - macOS/Linux: `~/.vscode/extensions/appium-tools.appium-agent-tools-0.1.0/`

---

## Next Steps

After successfully packaging and installing:

1. Verify the extension works (see [VERIFICATION.md](./VERIFICATION.md))
2. Test the tools with GitHub Copilot
3. Share the VSIX with team members
4. Consider publishing to VS Code Marketplace for wider distribution

For usage examples, see [USAGE.md](./USAGE.md).
