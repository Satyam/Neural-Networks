export const svg = document.getElementById('svg');

export const SVG_NS = 'http://www.w3.org/2000/svg';
export const WIDTH = 600;
export const HEIGHT = 600;

svg.setAttribute('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
svg.setAttribute('width', WIDTH);
svg.setAttribute('height', HEIGHT);

export const clearSVG = () => {
  svg.innerHTML = '';
};

export function appendSVGEl(parent, tag, attrs = {}, children) {
  const el = document.createElementNS(SVG_NS, tag);
  const appendChildren = (children) => {
    switch (typeof children) {
      case 'string':
        el.innerHTML = children;
        break;
      case 'undefined':
        break;
      case 'object':
        if (children instanceof Element) {
          el.appendChild(children);
          break;
        } else if (children[Symbol.iterator]) {
          for (const ch of children) {
            appendChildren(ch);
          }
          break;
        }
      // falls through
      default:
        throw new Error(
          `unkonwn children type ${typeof children}: ${children}`
        );
    }
  };
  for (const [attr, value] of Object.entries(attrs)) {
    if (attr === 'style') {
      switch (typeof value) {
        case 'string':
          el.style = value;
          break;
        case 'object':
          for (const [style, v] of Object.entries(value)) {
            el.style[style] = v;
          }
          break;
        default:
          throw new Error(
            `Unknown value type for style attribute: ${typeof value}`
          );
      }
    } else {
      el.setAttribute(attr, value);
    }
    appendChildren(children);
  }
  return parent.appendChild(el);
}
