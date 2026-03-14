export interface DomScanResult {
  viewportCoverage: number;
  zIndex: number;
  isFixed: boolean;
  isRecentlyInserted: boolean;
}

export function scanDom(element: Element, doc: Document): DomScanResult {
  const computed = getComputedStyle(element);
  const inline = (element as HTMLElement).style;
  const rect = element.getBoundingClientRect();

  const viewportW = doc.documentElement.clientWidth || 1;
  const viewportH = doc.documentElement.clientHeight || 1;
  let viewportCoverage = (rect.width * rect.height) / (viewportW * viewportH);

  // Fallback: check inline style for full-viewport indicators when layout isn't available
  if (viewportCoverage === 0 && inline) {
    const w = inline.width || '';
    const h = inline.height || '';
    const fullWidth = w === '100vw' || w === '100%';
    const fullHeight = h === '100vh' || h === '100%';
    if (fullWidth && fullHeight) viewportCoverage = 1;
    else if (fullWidth || fullHeight) viewportCoverage = 0.5;
  }

  const zIndex = parseInt(computed.zIndex, 10) || parseInt(inline?.zIndex, 10) || 0;
  const position = computed.position || inline?.position || '';
  const isFixed = position === 'fixed' || position === 'sticky' || position === 'absolute';

  // Check if recently inserted via data attribute or animation
  const isRecentlyInserted =
    element.hasAttribute('data-ghostkey-new') ||
    computed.animationName !== 'none' ||
    computed.transition !== '' && computed.transition !== 'all 0s ease 0s';

  return { viewportCoverage, zIndex, isFixed, isRecentlyInserted };
}
