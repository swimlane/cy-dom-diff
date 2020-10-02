import { DiffOptions } from '@open-wc/semantic-dom-diff/get-diffable-html';

import { PatternRegExp } from './lib/matchers';
import { clean, disambiguateArgs, getDom } from './lib/util';
import { chaiDomMatch } from './lib/assertion';

chai.use(chaiDomMatch);

type Options = Partial<Cypress.Loggable & Cypress.Timeoutable & DiffOptions> | undefined

function logDiff($el: any, re: PatternRegExp, options?: Options) {
  if (!re.pattern) {
    throw new Error(`Cannot generate a diff against ${re}`);
  }

  const a = clean(getDom($el), options);

  const log = Cypress.log({
    name: 'DOM Diff',
    message: 'DOM Difference',
    $el,
    consoleProps: () => {
      return {
        Subject: $el,
        Expected: re.replace(re.pattern),
        Actual: a,
        Difference: re.diff(a)
      };
    },
  });

  log.end();
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
