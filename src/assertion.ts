import { getDom, clean } from './util';

export const chaiDomMatch = (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) => {
  chai.Assertion.addProperty('dom', function dom() {
    utils.flag(this, 'original', utils.flag(this, 'object'));
    utils.flag(this, 'object', clean(getDom(utils.flag(this, 'object'))));
  });
};
