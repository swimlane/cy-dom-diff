import { getDiffableHTML, ProcessorOptions } from '@swimlane/dom-diff';

import { getDom, disambiguateArgs } from './util';

export const chaiDomMatch = (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) => {
  function assertDomMatch(
    this: Chai.AssertionStatic,
    re: RegExp,
    ...args: [string | ProcessorOptions, ProcessorOptions]
  ) {
    const [message, options] = disambiguateArgs(args) as [
      string,
      ProcessorOptions
    ];

    const negate = utils.flag(this, 'negate');
    const object = utils.flag(this, 'object');

    const dom = getDiffableHTML(getDom(object), options);

    if (negate) {
      new chai.Assertion(dom).not.match(re, message);
    } else {
      new chai.Assertion(dom).match(re, message);
    }
  }

  chai.Assertion.addMethod('domMatch', assertDomMatch);
};
