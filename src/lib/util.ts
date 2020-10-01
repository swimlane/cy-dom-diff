import disparity from 'disparity';
import { DiffOptions, getDiffableHTML } from '@open-wc/semantic-dom-diff/get-diffable-html';

const { isJquery, isElement } = Cypress.dom;

export function getDom($el: any) {
  if (isJquery($el)) {
    return $el.html();
  }
  if (isElement($el)) {
    return $el.innerHTML;
  }
  return $el; // TODO: errror
}

export function clean(html: string, options?: DiffOptions) {
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(html, 'text/html');
  // return getDiffableHTML(doc.body).replace(/\s+/g, '\n').trim()
  // return doc.body.innerHTML.replace(/\s+/g, '\n').trim();
  return getDiffableHTML(html, options);
}

function removeExplanation(text: string) {
  return text
    .split('\n')
    .filter((x) => !x.includes('--- removed'))
    .filter((x) => !x.includes('+++ added'))
    .filter((x) => !x.includes('@@ '))
    .filter((x) => !x.includes('No newline at end of file'))
    .join('\n')
    .replace(/\n+$/, '\n');
}

export function diff(a: string, b: string) {
  const textDiff = disparity.unifiedNoColor(a, b, {});
  return removeExplanation(textDiff);
}

export function disambiguateArgs(args: [string | object, object]): [string | undefined, object | undefined] {
  // @ts-ignore
  return args.length === 2 ? args :
    (typeof args[0] === 'object' ? [undefined, args[0]] : [args[0], undefined]);
}
