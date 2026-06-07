/** Elements that should NEVER be suppressed */

const SAFE_SELECTORS = [
  // Navigation / app shell (self-only: these generic elements can appear inside modals)
  'nav', 'header', 'footer', '[role="navigation"]', '[role="banner"]',
  // Native dialogs
  'dialog[open]',
];

const SAFE_CHILD_SELECTORS = [
  // Payment / checkout (check children: container may hold payment form)
  '[class*="payment"]', '[class*="checkout"]', '[class*="billing"]',
  '[id*="payment"]', '[id*="checkout"]', '[id*="billing"]',
  'form[action*="pay"]', 'form[action*="checkout"]',
  // File picker / upload
  '[class*="upload"]', '[class*="file-picker"]', 'input[type="file"]',
  // Cookie consent (separate concern)
  '[class*="cookie"]', '[class*="consent"]', '[id*="cookie"]', '[id*="consent"]',
];

const SAFE_TEXT_PATTERNS = [
  /pay(ment)?/i, /checkout/i, /billing/i, /credit card/i, /debit card/i,
  /shipping/i, /order summary/i, /purchase/i,
  /upload/i, /file picker/i, /choose file/i,
];

export function isSafeElement(element: Element): boolean {
  for (const sel of SAFE_SELECTORS) {
    try {
      if (element.matches(sel)) {
        return true;
      }
    } catch { /* invalid selector */ }
  }

  for (const sel of SAFE_CHILD_SELECTORS) {
    try {
      if (element.matches(sel) || element.querySelector(sel)) {
        return true;
      }
    } catch { /* invalid selector */ }
  }

  const text = (element.textContent || '').slice(0, 2000).toLowerCase();
  for (const pattern of SAFE_TEXT_PATTERNS) {
    if (pattern.test(text)) {
      if (element.querySelector('input[name*="card"], input[name*="cvv"], input[name*="expir"], input[name*="billing"], [data-testid*="payment"]')) {
        return true;
      }
    }
  }

  return false;
}
