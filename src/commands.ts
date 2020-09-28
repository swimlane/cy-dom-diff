import { getDiffableHTML } from '@open-wc/semantic-dom-diff';
import disparity from 'disparity';
import { PatternRegExp } from './matchers';
import { getDom } from './util';

function removeExplanation (text: string) {
  return text
    .split('\n')
    .filter(x => !x.includes('--- removed'))
    .filter(x => !x.includes('+++ added'))
    .filter(x => !x.includes('@@ '))
    .filter(x => !x.includes('No newline at end of file'))
    .join('\n')
    .replace(/\n+$/, '\n');
}

function textDifference(expected: string, value: string) {
  const textDiff = disparity.unifiedNoColor(expected, value, {})
  return removeExplanation(textDiff)
}

function logDiff(subject: any, re: PatternRegExp) {
  const d = getDiffableHTML(getDom(subject));
  const diff = textDifference(d, re.pattern);

  Cypress.log({
    name: 'Dom Diff',
    displayName: 'Dom Diff',
    // @ts-ignore
    state: 'failed',
    consoleProps: () => {
      return {
        Difference: diff
      }
    }
  }); 
}

Cypress.Commands.add('domDiff', { prevSubject: 'element'}, logDiff);

Cypress.Commands.add('domMatch', { prevSubject: 'element'}, (subject: any, re: PatternRegExp) => {
  cy.wrap(subject).should((el: any) => {
    try {
      expect(el).dom.to.match(re);
    } catch (e) {
      setTimeout(() => {
        if (!e.onFail) {
          logDiff(subject, re)
        }
      });
      throw e;
    }
  });
});