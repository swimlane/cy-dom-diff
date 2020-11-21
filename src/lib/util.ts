import {
  DiffOptions,
  getDiffableHTML,
} from '@open-wc/semantic-dom-diff/get-diffable-html';

import unindent from 'strip-indent';

const { isJquery, isElement } = Cypress.dom;

export const getDom = ($el: any) => {
  if (isJquery($el)) {
    return $el.html();
  }
  if (isElement($el)) {
    return $el.innerHTML;
  }
  return $el; // TODO: errror?
};

const domparser = new DOMParser();

export const clean = (html: string, options?: DiffOptions): string => {
  // Create a Node using DOMParser to avoid rendering in Cypress
  const doc = domparser.parseFromString(
    `<diff-container>${html}</diff-container>`,
    'text/html'
  );
  return unindent(getDiffableHTML(doc.body.firstChild as Node, options));
};

export const disambiguateArgs = (
  args: [
    string | Record<string, unknown> | undefined,
    Record<string, unknown> | undefined
  ]
): [string | undefined, Record<string, unknown> | undefined] => {
  if (args.length === 2) {
    return args as [string | undefined, Record<string, unknown> | undefined];
  }
  return typeof args[0] === 'object'
    ? [undefined, args[0]]
    : [args[0], undefined];
};
