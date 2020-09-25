import beautify from 'js-beautify';
import { getDiffableHTML } from '@open-wc/semantic-dom-diff';
import { unifiedNoColor } from 'disparity';

// function removeExplanation (text: string) {
//   return text
//     .split('\n')
//     .filter(x => !x.includes('--- removed'))
//     .filter(x => !x.includes('+++ added'))
//     .filter(x => !x.includes('@@ '))
//     .filter(x => !x.includes('No newline at end of file'))
//     .join('\n')
//     .replace(/\n+$/, '\n')
// }

// function textDifference(value: string, expected: string) {
//   const textDiff = unifiedNoColor(expected, value, {})
//   return removeExplanation(textDiff)
// }

function getSubject($el: any) {
  return Cypress.dom.isJquery($el) ? $el[0] : $el;
}

const getDomHtml = $el => $el[0].outerHTML;
const getLightDomHtml = $el => $el.html();
const getShadowDomHtml = $el => $el[0].shadowRoot.innerHTML;

export const chaiDomMatch = (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) => {
  chai.Assertion.addProperty('dom', function dom() {
    // new chai.Assertion(utils.flag(this, 'object')[0].nodeType).to.equal(1);
    utils.flag(this, 'dom', true);
  });

  chai.Assertion.addProperty('lightDom', function dom() {
    // new chai.Assertion(utils.flag(this, 'object')[0].nodeType).to.equal(1);
    utils.flag(this, 'lightDom', true);
  });

  chai.Assertion.addProperty('shadowHtml', function dom() {
    // new chai.Assertion(utils.flag(this, 'object')[0].nodeType).to.equal(1);
    utils.flag(this, 'shadowHtml', true);
  });

  const assertHtmlEquals = (actual: string, expected: string, negate: boolean, message: string) => {
    const assertion = new chai.Assertion(getDiffableHTML(actual), message);
    const expectedDiffableHTML = getDiffableHTML(expected);

    if (negate) {
      assertion.not.equal(expectedDiffableHTML, message);
    } else {
      assertion.equal(expectedDiffableHTML, message);
    }
  };

  const domEquals = (_super: any) => function handleDom(this: Chai.AssertionStatic, value: any, message: string, ...args: any[]) {
    if (utils.flag(this, 'lightDom')) {
      assertHtmlEquals(getLightDomHtml(this._obj), value, utils.flag(this, 'negate'), message);
    } else if (utils.flag(this, 'dom')) {
      assertHtmlEquals(getDomHtml(this._obj), value, utils.flag(this, 'negate'), message); 
    } else if (utils.flag(this, 'shadowDom')) {
      assertHtmlEquals(getShadowDomHtml(this._obj), value, utils.flag(this, 'negate'), message);
    } else {
      _super.apply(this, [value, message, ...args]);
    }
  };

  chai.Assertion.overwriteMethod('equals', domEquals);
  chai.Assertion.overwriteMethod('equal', domEquals);
  chai.Assertion.overwriteMethod('eq', domEquals);

  const assertHtmlMatches = (actual: string, expected: RegExp, negate: boolean, message: string) => {
    const assertion = new chai.Assertion(getDiffableHTML(actual), message);

    if (negate) {
      assertion.not.match(expected, message);
    } else {
      assertion.match(expected, message);
    }
  };

  const domMatches = (_super: any) => function handleDom(this: Chai.AssertionStatic, value: any, message: string, ...args: any[]) {
    if (utils.flag(this, 'lightDom')) {
      assertHtmlMatches(getLightDomHtml(this._obj), value, utils.flag(this, 'negate'), message);
    } else if (utils.flag(this, 'dom')) {
      assertHtmlMatches(getDomHtml(this._obj), value, utils.flag(this, 'negate'), message); 
    } else if (utils.flag(this, 'shadowDom')) {
      assertHtmlMatches(getShadowDomHtml(this._obj), value, utils.flag(this, 'negate'), message);
    } else {
      _super.apply(this, [value, message, ...args]);
    }
  };

  chai.Assertion.overwriteMethod('matches', domMatches);
  chai.Assertion.overwriteMethod('match', domMatches);
}