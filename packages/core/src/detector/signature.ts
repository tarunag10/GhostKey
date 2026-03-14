/** Generate a stable signature for a DOM element for loop detection */
export function computeSignature(element: Element): string {
  const parts: string[] = [];
  parts.push(element.tagName.toLowerCase());
  if (element.id) parts.push(`#${element.id}`);
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.split(/\s+/).sort().slice(0, 5).join('.');
    if (classes) parts.push(`.${classes}`);
  }
  // Include position in parent
  const parent = element.parentElement;
  if (parent) {
    const idx = Array.from(parent.children).indexOf(element);
    parts.push(`:nth(${idx})`);
  }
  return parts.join('');
}
