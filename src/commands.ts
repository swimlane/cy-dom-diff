import { DiffOptions } from '@open-wc/semantic-dom-diff/get-diffable-html';

import { PatternRegExp } from './lib/matchers';
import { clean, disambiguateArgs, getDom } from './lib/util';
import { chaiDomMatch } from './lib/assertion';

chai.use(chaiDomMatch);

type Options = Partial<Cypress.Loggable & Cypress.Timeoutable & DiffOptions> | undefined

function logDiff(name: string, state: string, $el: any, re: PatternRegExp, options?: Options) {
  if (!re.pattern) {
    throw new Error(`Cannot generate a diff against ${re}`);
  }

  const Actual = clean(getDom($el), options);
  const Expected = re.replace(re.pattern);
  const Difference = re.diff(Actual);

  Cypress.log({
    name,
    message: 'DOM Difference',
    $el,
    // @ts-ignore
    state,
    consoleProps: () => {
      return {
        Subject: $el,
        Expected,
        Actual,
        Difference
      };
    }
  });
}

Cypress.Commands.add('domDiff', { prevSubject: 'element' }, ($el: any, re: PatternRegExp, options?: Options) => {
  logDiff('domDiff', 'passed', $el, re, options);
});

Cypress.Commands.add(
  'domMatch',
  { prevSubject: 'element' },
  (subject: any, re: PatternRegExp, ...args: [string | Options, Options]) => {
    const [message, options] = disambiguateArgs(args as any) as [string | undefined, Options | undefined];

    cy.wrap(subject, options).should((el: any) => {
      try {
        expect(el).domMatch(re, message, options);
      } catch (e) {
        // this is a hack to only show the log after all retries have failed
        setTimeout(() => {
          if (!e.onFail) {
            logDiff('domMatch', 'failed', subject, re, options);
          }
        });
        throw e;
      }

      logDiff('domMatch', 'passed', subject, re, options);
    });
  }
);
