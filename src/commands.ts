import { DiffOptions } from '@open-wc/semantic-dom-diff/get-diffable-html';

import { PatternRegExp } from './lib/matchers';
import { clean, disambiguateArgs, getDom } from './lib/util';
import { chaiDomMatch } from './lib/assertion';

chai.use(chaiDomMatch);

type Options =
  | Partial<Cypress.Loggable & Cypress.Timeoutable & DiffOptions>
  | undefined;

function logDiff(
  name: string,
  state: string | undefined,
  $el: any,
  re: PatternRegExp,
  options?: Options
) {
  const Actual = clean(getDom($el), options);
  const Expected = re.pattern ? re.replace(re.pattern) : re;
  const Difference = re.diff ? re.diff(Actual) : undefined;

  if (state === undefined) {
    state = Difference === '' ? 'passed' : 'failed';
  }

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
        Difference,
      };
    },
  });
}

Cypress.Commands.add(
  'domDiff',
  { prevSubject: 'element' },
  ($el: any, re: PatternRegExp, options?: Options) => {
    logDiff('domDiff', undefined, $el, re, options);
  }
);

Cypress.Commands.add(
  'domMatch',
  { prevSubject: 'element' },
  (subject: any, re: PatternRegExp, ...args: [string | Options, Options]) => {
    const [message, options] = disambiguateArgs(args as any) as [
      string | undefined,
      Options | undefined
    ];

    const onFail = (err: Error) => {
      if (err.name === 'AssertionError') {
        logDiff('domMatch', 'failed', subject, re, options);
      }
      return err;
    };

    cy.wrap(subject, options).should((el: any) => {
      cy.on('fail', onFail);
      expect(el).domMatch(re, message, options);
      cy.removeListener('fail', onFail);
      logDiff('domMatch', 'passed', subject, re, options);
    });
  }
);
