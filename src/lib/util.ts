import disparity from 'disparity';
import { DiffOptions, getDiffableHTML } from '@open-wc/semantic-dom-diff/get-diffable-html';
import { PatternRegExp } from './matchers';

import * as Diff from 'diff';

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

export function clean(html: string, options?: DiffOptions) {
  return getDiffableHTML(html, options);
}

function removeExplanation(text: string) {
  // remove header
  text = text.replace(/^([^\n]+)\n([^\n]+)\n/m, '').replace(/--- \t\n/g, '').replace(/\+\+\+ \t\n/g, '');

  return text
    .split('\n')
    .filter((x) => !x.includes('--- removed'))
    .filter((x) => !x.includes('+++ added'))
    .filter((x) => !x.includes('@@ '))
    .filter((x) => !x.includes('No newline at end of file'))
    .join('\n')
    .replace(/\n+$/, '\n');
}

export function diff(a: string, b: PatternRegExp) {
  if (!b.pattern) {
    throw new Error(`Cannot generate a diff against ${b}`);
  }

  const options = {
    comparator: (l: string, r: string) => b.compare(l, r)
  };

  const changes = Diff.createPatch('', b.pattern, a, '', '', options as any);
  return removeExplanation(b.replace(changes));
}

export function disambiguateArgs(args: [string | object, object]): [string | undefined, object | undefined] {
  // @ts-ignore
  return args.length === 2 ? args :
    (typeof args[0] === 'object' ? [undefined, args[0]] : [args[0], undefined]);
}
