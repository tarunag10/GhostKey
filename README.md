# GhostKey

> Created by **Tarun Agarwal**

Chrome & Safari extension that suppresses intrusive login popups and restores page usability.

## Supported Sites

- LinkedIn, Quora, Reddit, Pinterest, Twitter/X, Instagram, Medium
- Generic heuristic fallback for all other sites

## Install

### Chrome
1. Run `npm run build:chrome`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" → select `dist/chrome/`

### Safari
1. Run `npm run build:chrome` (builds the shared web extension files)
2. Build the Safari extension:
   ```bash
   cd apps/safari-extension/GhostKey
   xcodebuild -scheme "GhostKey (macOS)" -configuration Debug build
   ```
3. Launch the built GhostKey.app (it must stay running)
4. In Safari: **Develop → Allow Unsigned Extensions**
5. Enable GhostKey in **Safari → Settings → Extensions**

> 📖 See [Safari Extension Debug Guide](docs/safari-extension-debug-guide.md) for troubleshooting

## Development

```bash
npm install
npm test
npm run build:chrome
```

## Architecture

```
packages/core/             — Detector, classifier, suppressor, restorer engine
packages/browser-shared/   — Storage, messaging, logger facades
packages/rule-packs/       — Site-specific rules (7 sites + generic)
apps/chrome-extension/     — Chrome MV3 extension (popup, options, content/background scripts)
apps/safari-extension/     — Safari Web Extension (Xcode project wrapping the Chrome extension)
```

## How It Works

1. **Detect** — Scans for fixed/high-z-index elements with login text, scroll locks, backdrops
2. **Classify** — Scores candidates, applies safety rules (skip payment/checkout/nav)
3. **Suppress** — Hides modals, unlocks scroll, removes blur/backdrop
4. **Restore** — Undo all suppressions via popup button or site toggle

## Modes

- **Conservative** (default) — Only suppresses high-confidence login walls
- **Aggressive** — Lower threshold, may catch more popups but risk false positives

---

## Recommended MCP Servers for Development

These are free, open-source MCP servers you can add to VS Code for AI-assisted development. Add them to your global VS Code settings (**Cmd+Shift+P** → "Preferences: Open User Settings (JSON)"):

```json
"mcp": {
  "servers": {
    "xcodebuildmcp": {
      "command": "npx",
      "args": ["-y", "xcodebuildmcp@latest"]
    },
    "browser-tools": {
      "command": "npx",
      "args": ["-y", "@anthropic/browser-tools-mcp@latest"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropic/playwright-mcp@latest"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/github-mcp@latest"]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@anthropic/fetch-mcp@latest"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@anthropic/memory-mcp@latest"]
    }
  }
}
```

### What each one does

| Server | Purpose |
|---|---|
| **xcodebuildmcp** | Build/run Xcode projects (iOS, macOS, Safari extensions) |
| **browser-tools** | Control browser, read console logs, inspect network requests |
| **playwright** | Automate browser testing, take screenshots, interact with pages |
| **github** | Create PRs, manage issues, search repos directly from AI |
| **fetch** | Fetch any URL, read web pages for context |
| **memory** | Persistent AI memory across conversations |

### More MCP servers
- Browse the full directory: [https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
- Anthropic docs: [https://docs.anthropic.com/en/docs/agents-and-tools/mcp](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
