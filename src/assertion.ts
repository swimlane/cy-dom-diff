import { getDiffableHTML } from '@open-wc/semantic-dom-diff';

import { getDom } from './util';

export const chaiDomMatch = (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) => {
  chai.Assertion.addProperty('dom', function dom() {
    utils.flag(this, 'original', utils.flag(this, 'object'));
    utils.flag(this, 'object', getDiffableHTML(getDom(utils.flag(this, 'object'))));
  });
}