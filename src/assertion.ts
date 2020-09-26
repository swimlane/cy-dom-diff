import { getDiffableHTML } from '@open-wc/semantic-dom-diff';

const getSubject = ($el: any) => Cypress.dom.isJquery($el) ? $el[0] : $el;

const getDomHtml = ($el: JQuery<any>) => getSubject($el).outerHTML;
const getLightDomHtml = ($el: JQuery<any>) => getSubject($el).innerHTML;
const getShadowDomHtml = ($el: JQuery<any>) => getSubject($el).shadowRoot.innerHTML;

export const chaiDomMatch = (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) => {
  chai.Assertion.addProperty('dom', function dom() {
    const el = utils.flag(this, 'object');
    utils.flag(this, 'object', getDiffableHTML(getDomHtml(el)));
  });

  chai.Assertion.addProperty('lightDom', function dom() {
    const el = utils.flag(this, 'object');
    utils.flag(this, 'object', getDiffableHTML(getLightDomHtml(el)));
  });

  chai.Assertion.addProperty('shadowHtml', function dom() {
    const el = utils.flag(this, 'object');
    utils.flag(this, 'object', getDiffableHTML(getShadowDomHtml(el)));
  });
}