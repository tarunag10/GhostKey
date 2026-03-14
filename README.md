# GhostKey

Chrome extension that suppresses intrusive login popups and restores page usability.

## Supported Sites

- LinkedIn, Quora, Reddit, Pinterest, Twitter/X, Instagram, Medium
- Generic heuristic fallback for all other sites

## Development

```bash
npm install
npm test
npm run build:chrome
```

## Install in Chrome

1. Run `npm run build:chrome`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" → select `dist/chrome/`

## Architecture

- `packages/core/` — Detector, classifier, suppressor, restorer engine
- `packages/browser-shared/` — Storage, messaging, logger facades
- `packages/rule-packs/` — Site-specific rules (7 sites + generic)
- `apps/chrome-extension/` — Chrome MV3 extension (popup, options, content/background scripts)

## How It Works

1. **Detect** — Scans for fixed/high-z-index elements with login text, scroll locks, backdrops
2. **Classify** — Scores candidates, applies safety rules (skip payment/checkout/nav)
3. **Suppress** — Hides modals, unlocks scroll, removes blur/backdrop
4. **Restore** — Undo all suppressions via popup button or site toggle

## Modes

- **Conservative** (default) — Only suppresses high-confidence login walls
- **Aggressive** — Lower threshold, may catch more popups but risk false positives
