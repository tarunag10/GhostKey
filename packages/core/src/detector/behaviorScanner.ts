export interface BehaviorScanResult {
  hasScrollLock: boolean;
  hasBackdrop: boolean;
  hasBlurOverlay: boolean;
  hasPointerBlock: boolean;
}

export function scanBehavior(element: Element, doc: Document): BehaviorScanResult {
  const body = doc.body;
  const html = doc.documentElement;
  const bodyStyle = body ? getComputedStyle(body) : null;
  const htmlStyle = getComputedStyle(html);

  const hasScrollLock =
    bodyStyle?.overflow === 'hidden' ||
    htmlStyle.overflow === 'hidden' ||
    bodyStyle?.overflowY === 'hidden' ||
    htmlStyle.overflowY === 'hidden' ||
    body?.classList.contains('no-scroll') ||
    body?.classList.contains('modal-open') ||
    body?.classList.contains('overflow-hidden');

  // Check for backdrop/overlay siblings or parent
  const style = getComputedStyle(element);
  const hasBackdrop = isBackdrop(element, doc);

  // Check for blur on body content
  const hasBlurOverlay = checkBlurOverlay(element, doc);

  // Check if pointer events are blocked on underlying content
  const hasPointerBlock =
    bodyStyle?.pointerEvents === 'none' ||
    checkPointerBlock(element, doc);

  return { hasScrollLock, hasBackdrop, hasBlurOverlay, hasPointerBlock };
}

function isBackdrop(element: Element, doc: Document): boolean {
  const style = getComputedStyle(element);

  // Element itself is a backdrop
  if (
    style.position === 'fixed' &&
    parseFloat(style.opacity) < 1 &&
    element.getBoundingClientRect().width >= doc.documentElement.clientWidth * 0.9 &&
    element.getBoundingClientRect().height >= doc.documentElement.clientHeight * 0.9
  ) {
    return true;
  }

  // Check siblings
  const parent = element.parentElement;
  if (!parent) return false;

  for (const sibling of parent.children) {
    if (sibling === element) continue;
    const sibStyle = getComputedStyle(sibling);
    const cls = sibling.className?.toString().toLowerCase() || '';
    if (
      cls.includes('backdrop') || cls.includes('overlay') || cls.includes('mask') ||
      (sibStyle.position === 'fixed' && parseFloat(sibStyle.opacity) < 1 &&
       sibling.getBoundingClientRect().width >= doc.documentElement.clientWidth * 0.9)
    ) {
      return true;
    }
  }

  return false;
}

function checkBlurOverlay(_element: Element, doc: Document): boolean {
  // Check if any main content wrapper has blur/opacity applied
  const mainSelectors = ['main', '#root', '#app', '#__next', '[role="main"]', '.content'];
  for (const sel of mainSelectors) {
    const main = doc.querySelector(sel);
    if (!main) continue;
    const style = getComputedStyle(main);
    if (style.filter && style.filter !== 'none') return true;
    if (parseFloat(style.opacity) < 0.5) return true;
  }
  return false;
}

function checkPointerBlock(_element: Element, doc: Document): boolean {
  const mainSelectors = ['main', '#root', '#app', '#__next', '[role="main"]'];
  for (const sel of mainSelectors) {
    const main = doc.querySelector(sel);
    if (!main) continue;
    const style = getComputedStyle(main);
    if (style.pointerEvents === 'none') return true;
  }
  return false;
}
