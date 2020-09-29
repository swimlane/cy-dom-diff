import { PatternRegExp } from './matchers';
import { clean, diff, getDom } from './util';

function logDiff(subject: any, re: PatternRegExp) {
  const a = clean(getDom(subject));
  const d = diff(a, re.rec(a));

  Cypress.log({
    name: 'Dom Diff',
    displayName: 'Dom Diff',
    // @ts-ignore
    state: 'failed',
    consoleProps: () => {
      return {
        Pattern: re.pattern,
        Regexp: re,
        Actual: a,
        Difference: d,
      };
    },
  });
}

Cypress.Commands.add('domDiff', { prevSubject: 'element' }, logDiff);

Cypress.Commands.add(
  'domMatch',
  { prevSubject: 'element' },
  (subject: any, re: PatternRegExp) => {
    cy.wrap(subject).should((el: any) => {
      try {
        expect(el).dom.to.match(re);
      } catch (e) {
        setTimeout(() => {
          if (!e.onFail) {
            logDiff(subject, re);
          }
        });
        throw e;
      }

      logDiff(subject, re);
    });
  }
);
