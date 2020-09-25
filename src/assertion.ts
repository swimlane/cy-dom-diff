import beautify from 'js-beautify';
import { getDiffableHTML } from '@open-wc/semantic-dom-diff';
import { unifiedNoColor } from 'disparity';

import { Matcher, MatcherType } from './matchers'

function removeExplanation (text: string) {
  return text
    .split('\n')
    .filter(x => !x.includes('--- removed'))
    .filter(x => !x.includes('+++ added'))
    .filter(x => !x.includes('@@ '))
    .filter(x => !x.includes('No newline at end of file'))
    .join('\n')
    .replace(/\n+$/, '\n')
}

function textDifference(value: string, expected: string) {
  const textDiff = unifiedNoColor(expected, value, {})
  return removeExplanation(textDiff)
}

export const chaiDomMatch = (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) => {
  chai.Assertion.overwriteMethod('match', (_super) => {
    return function (this: any, ...args: any) {
      // console.log(args);
      if (args[0] instanceof Matcher) {
        const matcher = args[0];
        let source: RegExp;
        let subject = this._obj;
        let pattern: string;
        let $el = subject;
  
        switch (matcher.type) {
          case MatcherType.HTML:
            subject = getDiffableHTML(subject.html());
            break;
          case MatcherType.JSON:
            subject = beautify.js(JSON.stringify(subject));
            break
        }
        source = matcher.re;
        pattern = matcher.source;
  
        if (Cypress.dom.isJquery(subject)) {
          subject = beautify.js(subject.text());
        }
  
        const message =  `expect ${subject} to match ${source}`;
        const isMatch = source.test(subject);

        return this.assert(isMatch, message);

        // if (!isMatch) {
        //   throw new chai.AssertionError(message,
        //     {
        //       actual: subject,
        //       expected: pattern,
        //       showDiff: true,
        //     },
        //     utils.flag(this, 'ssfi'),
        //   );
        // }

        return;
  
        // this._obj = subject;
  
        // const log = {
        //   name: 'Match',
        //   $el,
        //   message,
        //   state: match ? 'passed' : 'failed',
        //   consoleProps: () => {
        //     return {
        //       $el,
        //       subject,
        //       pattern,
        //       difference: textDifference(subject, pattern)
        //     }
        //   }
        // };
  
        // // @ts-ignore
        // const current = cy.state('current')
        // const currentAssertionCommand = current?.get('currentAssertionCommand')
        // const logs = currentAssertionCommand?.get('logs') || [];
  
        // if (logs.length === 0) {
        //   Cypress.log(log);
        // } else {
        //   logs[0].set(log);
        // }

        // return this.assert(match, message);
      }
      return _super.apply(this, args);
    }
  });
}