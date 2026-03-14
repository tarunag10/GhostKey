# GhostKey Development Log

All implementation steps, changes, and decisions are documented here.

---

## 2026-03-14: Initial Implementation (v1.0.0)

### Step 1: Monorepo Scaffold
- Created npm workspaces monorepo with 4 workspaces:
  - `packages/core` — detector, classifier, suppressor, restorer, types
  - `packages/browser-shared` — storage, messaging, logger facades
  - `packages/rule-packs` — site-specific rule definitions
  - `apps/chrome-extension` — Chrome MV3 extension
- Root config: `tsconfig.json` (composite project refs), `vitest.config.ts` (jsdom env), `.gitignore`
- Build tooling: esbuild, TypeScript 5.4, Vitest with jsdom

### Step 2: Chrome MV3 Skeleton
- `manifest.json` — MV3 with permissions: activeTab, storage, scripting
- Background service worker: handles GET_STATUS, TOGGLE_SITE, UNDO_SUPPRESSION messages
- Content script: initializes detection engine, listens for toggle/undo messages
- Popup: site status, toggle button, undo button (dark theme)
- Options page: global toggle, aggressive mode, debug mode, allowlist editor

### Step 3: Shared Types & Facades
- `packages/core/src/types/` — CandidateBlocker, DetectorScores, ClassificationResult, SuppressionAction, RulePack, Settings
- `packages/browser-shared/src/storage/` — storageFacade wrapping chrome.storage.local
- `packages/browser-shared/src/messaging/` — messagingFacade wrapping chrome.runtime
- `packages/browser-shared/src/logger/` — debug logger with setDebug toggle

### Step 4: Detector
- **DOM scanner**: viewport coverage (with inline style fallback for jsdom), z-index, position:fixed/sticky/absolute, recent insertion
- **Text scanner**: 20+ login/signup phrases, strong phrases ("sign in to continue"), form input detection (email/password fields)
- **Behavior scanner**: scroll lock (overflow:hidden, .no-scroll, .modal-open), backdrop detection, blur overlay detection, pointer-events blocking
- **Signature generator**: stable element fingerprint for loop detection
- Scoring formula: viewportCoverage×3 + isFixed×2 + highZIndex×2 + textMatch×3 + scrollLock×2 + backdrop×1.5 + blur×1.5 + pointerBlock×1
- 7 unit tests passing

### Step 5: Classifier
- Threshold-based: conservative=7, aggressive=4
- **Safety rules**: never suppress payment/checkout, navigation, cookie consent, file pickers
- **Loop protector**: max 5 suppressions per signature, 10s cooldown
- Builds appropriate SuppressionAction list based on detected behaviors
- 8 unit tests passing

### Step 6: Suppressor & Restorer
- **Suppressor**: HIDE_ELEMENT (display:none!important), REMOVE_ELEMENT (with parent/sibling refs), UNLOCK_SCROLL, REMOVE_BACKDROP, REMOVE_BLUR, RESTORE_POINTER_EVENTS
- Each action records original state for reversal
- **Restorer**: reverses all actions in LIFO order, supports restoreAll() and restoreLast()
- **DomObserver**: MutationObserver wrapper with 300ms debounce, watches childList+attributes
- 4 unit tests passing

### Step 7: Popup UI & Options Page
- Popup: status dot (green/red), hostname display, toggle/undo buttons
- Options: checkboxes for global/aggressive/debug, textarea for allowlist, supported sites list
- Dark theme (#1a1a2e / #16213e / #00d4ff accent)

### Step 8: Rule Packs (7 sites + generic)
- **LinkedIn**: .authentication-outlet, .artdeco-modal, .contextual-sign-in-modal
- **Quora**: SignupModal, LoginModal, signup_wall
- **Reddit**: shreddit-signup-drawer, bundlename="login", XPromoPopup
- **Pinterest**: UnauthBanner, signup-modal, UnauthOverlay
- **Twitter/X**: #layers overlay, sheetDialog, LoginForm
- **Instagram**: LoginAndSignup, LoginForm, SignUpForm
- **Medium**: meteredContent, upsell, paywall
- **Generic**: role="dialog", aria-modal, class*="login/signup/modal"
- Rule loader with host pattern matching and priority sorting

### Step 9: Fixture Tests
- 7 HTML fixtures: login-modal, blur-blocker, scroll-lock, false-positive-nav, checkout-modal, app-install, cookie-banner
- Integration tests: suppresses login/blur/scroll-lock modals, does NOT suppress nav/checkout/cookie
- Restorer test: verifies undo restores original state
- All 7 tests passing

### Step 10: Build & Integration
- esbuild build script with @ghostkey/* path resolution plugin
- Produces loadable Chrome extension in `dist/chrome/`
- Output: content.js (32.5kb), background.js (1.8kb), popup.js (1.8kb), options.js (1.3kb)
- Rule validation script: all 7 packs valid

### Bug Fix: jsdom inline style fallback
- `getComputedStyle` in jsdom doesn't always report inline styles; added fallback to check `element.style` directly for position, z-index
- Added viewport coverage heuristic: if `getBoundingClientRect` returns 0 (jsdom), check for `width: 100vw/100%` inline styles

### Verification Results
- `npm install` — succeeds
- `npm test` — 26/26 tests pass (4 test files)
- `npm run build:chrome` — produces loadable extension in dist/chrome/
- `npm run validate:rules` — all 7 rule packs valid
