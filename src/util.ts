import disparity from 'disparity';
import { getDiffableHTML } from '@open-wc/semantic-dom-diff';

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

export function clean(html: string) {
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(html, 'text/html');
  // return getDiffableHTML(doc.body).replace(/\s+/g, '\n').trim()
  // return doc.body.innerHTML.replace(/\s+/g, '\n').trim();
  return getDiffableHTML(html);
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
