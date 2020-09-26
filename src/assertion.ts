import { getDiffableHTML } from '@open-wc/semantic-dom-diff';

const { isJquery, isElement } = Cypress.dom;

const getDomHtml = ($el: HTMLElement) => $el.outerHTML;
const getLightDomHtml = ($el: HTMLElement) => $el.innerHTML;
const getShadowDomHtml = ($el: HTMLElement) => $el.shadowRoot ? $el.shadowRoot.innerHTML : '';

export const chaiDomMatch = (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) => {
  function getElement(ctx: Chai.AssertionStatic) {
    let $el = utils.flag(ctx, 'object');
    if (isJquery($el)) {
      $el = $el[0];
    }
    new chai.Assertion(isElement($el), `expected ${$el} to be DOM like`).true;
    return $el;
  }

  chai.Assertion.addProperty('dom', function dom() {
    utils.flag(this, 'object', getDiffableHTML(getDomHtml(getElement(this))));
  });

  chai.Assertion.addProperty('lightDom', function dom() {
    utils.flag(this, 'object', getDiffableHTML(getLightDomHtml(getElement(this))));
  });

  chai.Assertion.addProperty('shadowHtml', function dom() {
    utils.flag(this, 'object', getDiffableHTML(getShadowDomHtml(getElement(this))));
  });
}