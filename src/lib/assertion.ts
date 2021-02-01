import { getDiffableHTML } from '@swimlane/dom-diff';

import { DiffOptions } from '@open-wc/semantic-dom-diff/get-diffable-html';

import { getDom, disambiguateArgs } from './util';

export const chaiDomMatch = (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) => {
  function assertDomMatch(
    this: Chai.AssertionStatic,
    re: RegExp,
    ...args: [string | DiffOptions, DiffOptions]
  ) {
    const [message, options] = disambiguateArgs(args) as [string, DiffOptions];

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
