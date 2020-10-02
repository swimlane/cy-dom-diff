import { DiffOptions } from '@open-wc/semantic-dom-diff/get-diffable-html';

import { PatternRegExp } from './lib/matchers';
import { clean, diff, disambiguateArgs, getDom } from './lib/util';
import { chaiDomMatch } from './lib/assertion';

chai.use(chaiDomMatch);

type Options = Partial<Cypress.Loggable & Cypress.Timeoutable & DiffOptions> | undefined

function logDiff(subject: any, re: PatternRegExp, options?: Options) {
  const a = clean(getDom(subject), options);
  const d = diff(a, re);

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
  (subject: any, re: PatternRegExp, ...args: [string | Options, Options]) => {
    const [message, options] = disambiguateArgs(args as any) as [string | undefined, Options | undefined];

    cy.wrap(subject, options).should((el: any) => {
      try {
        expect(el).domMatch(re, message, options);
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
