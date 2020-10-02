import {
  DiffOptions,
  getDiffableHTML,
} from '@open-wc/semantic-dom-diff/get-diffable-html';

import unindent from 'strip-indent';

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

const domparser = new DOMParser();

export function clean(html: string, options?: DiffOptions): string {
  // Create a Node using DOMParser to avoid rendering
  const doc = domparser.parseFromString(
    `<diff-container>${html}</diff-container>`,
    'text/html'
  );
  return unindent(getDiffableHTML(doc.body.firstChild as Node, options));
}

export function disambiguateArgs(
  args: [string | object | undefined, object | undefined]
): [string | undefined, object | undefined] {
  if (args.length === 2) {
    return args as [string | undefined, object | undefined];
  }
  return typeof args[0] === 'object'
    ? [undefined, args[0]]
    : [args[0], undefined];
}
