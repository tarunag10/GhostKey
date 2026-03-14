# GhostKey Architecture

## Pipeline

```
Content Script (page load / mutation)
  → Detector (DOM + text + behavior scanning)
  → Classifier (threshold + safety rules + loop protection)
  → Suppressor (hide/remove/unlock actions)
  → Restorer (undo stack)
```

## Packages

### @ghostkey/core
- `detector/` — DOM scanner, text scanner, behavior scanner, signature generator
- `classifier/` — Threshold classifier, safety rules, loop protector
- `suppressor/` — Action executor with undo state recording
- `restorer/` — Reverses all suppressor actions
- `heuristics/domObserver` — MutationObserver wrapper for re-scanning
- `types/` — All shared TypeScript types

### @ghostkey/browser-shared
- `storage/` — Chrome storage facade
- `messaging/` — Chrome runtime messaging facade
- `logger/` — Debug logger (console, local-only)

### @ghostkey/rule-packs
- `sites/` — LinkedIn, Quora, Reddit, Pinterest, Twitter/X, Instagram, Medium
- `generic/` — Fallback heuristic rules for unsupported sites

### @ghostkey/chrome-extension
- `background/` — Service worker handling messages
- `content/` — Injects core engine, listens for toggle/undo
- `popup/` — Status display, site toggle, undo button
- `options/` — Global settings, aggressive mode, allowlist

## Scoring

Total score = viewportCoverage×3 + isFixed×2 + highZIndex×2 + textMatch×3 + scrollLock×2 + backdrop×1.5 + blur×1.5 + pointerBlock×1

- Conservative threshold: 7
- Aggressive threshold: 4

## Safety Rules

Never suppress: payment forms, checkout, navigation, cookie consent, file pickers.
