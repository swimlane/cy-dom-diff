import { DiffOptions, getDiffableHTML } from '@open-wc/semantic-dom-diff/get-diffable-html';

const { isJquery, isElement } = Cypress.dom;

export function getDom($el: any) {
  if (isJquery($el)) {
    return $el.html();
  }
  if (isElement($el)) {
    return $el.innerHTML;
  }
  return $el; // TODO: errror?
}

const domparser = new DOMParser()​​;

export function clean(html: string, options?: DiffOptions) {
  const doc = domparser.parseFromString(html, 'text/html');  // converts to a dom node without rendering
  return getDiffableHTML(doc.body, options);
}

export function disambiguateArgs(args: [string | object, object]): [string | undefined, object | undefined] {
  // @ts-ignore
  return args.length === 2 ? args :
    (typeof args[0] === 'object' ? [undefined, args[0]] : [args[0], undefined]);
}
