import { DiffOptions } from '@open-wc/semantic-dom-diff/get-diffable-html';

import { PatternRegExp } from './lib/matchers';
import { clean, disambiguateArgs, getDom } from './lib/util';
import { chaiDomMatch } from './lib/assertion';

chai.use(chaiDomMatch);

type Options =
  | Partial<Cypress.Loggable & Cypress.Timeoutable & DiffOptions>
  | undefined;

const logDiff = (
  name: string,
  state: string | undefined,
  $el: any,
  re?: PatternRegExp,
  options?: Options
) => {
  const actual = clean(getDom($el), options);
  const expected = re?.pattern ? re.replace(re.pattern) : re;
  const difference = re?.diff ? re.diff(actual) : undefined;

  if (state === undefined) {
    state = difference === '' ? 'passed' : 'failed';
  }

  Cypress.log({
    name,
    message: 'DOM Difference',
    $el,
    // @ts-ignore
    state,
    consoleProps: () => {
      return {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Subject: $el,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Expected: expected,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Actual: actual,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Difference: difference,
      };
    },
  });
};

Cypress.Commands.add(
  'domDiff',
  { prevSubject: 'element' },
  ($el: any, re?: PatternRegExp, options?: Options) => {
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
