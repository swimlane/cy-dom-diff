
import faker from 'faker';
import { chaiDomDiff } from '@open-wc/semantic-dom-diff';

import { chaiDomMatch } from '../../src/assertion';
import { html } from '../../src/matchers';
import { NUMBER, WORD, PROP, VALUES } from '../../src/regexps'

// chai.use(chaiDomDiff);
chai.use(chaiDomMatch);

const TIME = /\d?\d:\d?\d\:\d?\d/;

describe('spec', () => {
  before(() => {
    cy.visit('index.html');
    cy.get('.random-number').then($el => {
      $el.text(faker.random.number());
    });
    cy.get('.random-word').then($el => {
      $el.text(faker.random.word());
    });
  });

  describe('html template tag', () => {
    it('generates a regex', () => {
      expect(html`<h1>Hello World</h1>`).to.be.instanceof(RegExp);
      expect(html`<h1>Hello World</h1>`.source).to.equal(/^<h1>\n  Hello World\n<\/h1>\n$/.source);
      expect(html`<h1>Hello World</h1>`.source).to.equal(/^<h1>\n  Hello World\n<\/h1>\n$/.source);
      expect(html`<h1>Hello ${WORD}</h1>`.source).to.equal(/^<h1>\n  Hello [\w\-]+\n<\/h1>\n$/.source);
    });
    
    it('cleans generated html', () => {
      expect(html`<h1 class="z y x">Hello World</h1>`.source).to.equal(/^<h1 class="x y z">\n  Hello World\n<\/h1>\n$/.source);
    });
  });

  describe('expect', () => {
    let el: any;
    let $el: JQuery<any>;

    before(() => {
      cy.document().then((doc) => {
        el = doc.getElementById('test-1');
        $el = Cypress.$('#test-1');
      });
    });

    describe('element', () => {
      it('equals', () => {
        expect(el).dom.equals('<div\n  class="test"\n  id="test-1"\n>\n  <h1>\n    Hello World\n  </h1>\n</div>\n');
        expect(el).lightDom.to.equal('<h1>\n  Hello World\n</h1>\n');
      });

      it('not equals', () => {
        expect(el).dom.not.equals('<div\n  class="test"\n  id="test-1"\n>\n  <h1>\n    Hello Earth\n  </h1>\n</div>\n');
        expect(el).lightDom.to.not.equal('<h1>\n  Hello Earth\n</h1>\n');
      });

      it('matches', () => {
        expect(el).dom.matches(/Hello World/);
        expect(el).dom.to.match(html`<div class="test" id="test-1"><h1>Hello World</h1></div>`);
        expect(el).lightDom.matches(html`<h1>Hello World</h1>`);
      });

      it('not matches', () => {
        expect(el).dom.not.matches(/Hello Earth/);
        expect(el).dom.to.not.match(html`<div class="test" id="test-1"><h1>Hello Earth</h1></div>`);
        expect(el).not.lightDom.matches(html`<h1>Hello Earth</h1>`);
      });      
    });

    describe('jQuery node', () => {
      it('equals', () => {
        expect($el).dom.equals('<div\n  class="test"\n  id="test-1"\n>\n  <h1>\n    Hello World\n  </h1>\n</div>\n');
        expect($el).lightDom.to.equal('<h1>\n  Hello World\n</h1>\n');
      });

      it('not equals', () => {
        expect($el).dom.not.equals('<div\n  class="test"\n  id="test-1"\n>\n  <h1>\n    Hello Earth\n  </h1>\n</div>\n');
        expect($el).lightDom.to.not.equal('<h1>\n  Hello Earth\n</h1>\n');
      });

      it('matches', () => {
        expect($el).dom.matches(/Hello World/);
        expect($el).dom.to.match(html`<div class="test" id="test-1"><h1>Hello World</h1></div>`);
        expect($el).lightDom.matches(html`<h1>Hello World</h1>`);
      });

      it('not matches', () => {
        expect($el).dom.not.matches(/Hello Earth/);
        expect($el).dom.to.not.match(html`<div class="test" id="test-1"><h1>Hello Earth</h1></div>`);
        expect($el).not.lightDom.matches(html`<h1>Hello Earth</h1>`);
      });      
    });


  });

  describe.skip('assert', () => {
    let $el: JQuery<any>;

    before(() => {
      cy.visit('index.html');
      cy.document().then((doc) => {
        $el = Cypress.$('#test-1');
      });
    });

    it('equals', () => {
      assert.dom.equals($el, '<div\n  class="test"\n  id="test-1"\n>\n  <h1>\n    Hello World\n  </h1>\n</div>\n');
      assert.lightDom.equals($el, '<h1>\n  Hello World\n</h1>\n');
    });
  });

  describe('cypress', () => {
    it('equals', () => {
      cy.get('#test-1').should('dom.equals', '<div\n  class="test"\n  id="test-1"\n>\n  <h1>\n    Hello World\n  </h1>\n</div>\n');
      cy.get('#test-1').should('have.lightDom.that.equals', '<h1>\n  Hello World\n</h1>\n');
    });

    it('not equals', () => {
      cy.get('#test-1').should('not.dom.equals', '<div\n  class="test"\n  id="test-1"\n>\n  <h1>\n    Hello Earth\n  </h1>\n</div>\n');
      cy.get('#test-1').should('have.lightDom.that.does.not.equal', '<h1>\n  Hello Earth\n</h1>\n');
    });

    it('matches', () => {
      cy.get('#test-1').should('lightDom.matches', html`<h1>Hello World</h1>`);
      cy.get('#test-2').should('have.lightDom.that.matches', html`<h1>Hello <span class="random-number">${NUMBER}</span></h1>`);
      cy.get('#test-3').should('lightDom.to.match', html`<h1>Hello <span class="random-word">${WORD}</span></h1>`);

      cy.get('#clock').should('dom.matches', html`<div id="clock"><span>The currrent time is:</span>\n<span class="clock">${TIME} ${/[AP]/}M</span> <span class="offset">${NUMBER}</span> hrs</div>`);
      cy.get('#clock').should('lightDom.matches', html`<span>The currrent time is:</span>\n <span class="clock">${TIME} ${/[AP]/}M</span> <span class="offset">${NUMBER}</span> hrs`);
    });

    it('not matches', () => {
      cy.get('#test-1').should('lightDom.not.matches', html`<h1>Hello Earth</h1>`);
      cy.get('#test-2').should('have.lightDom.that.does.not.match', html`<h1>Goodbye <span class="random-number">${NUMBER}</span></h1>`);
      cy.get('#test-3').should('lightDom.to.not.match', html`<h1>Goodbye <span class="random-word">${WORD}</span></h1>`);

      cy.get('#clock').should('lightDom.not.matches', html`<span>The currrent time is:</span>\n<span class="clock"></span> <span class="offset">${NUMBER}</span> hrs`);
    });

    it.skip('failing with pattern', () => {
      // cy.get('#test-1').should('have.html', /Goodbye/);
      cy.get('#test-1').should('dom.equals', html`<h3>Hello ${WORD}</h3>`);
    });
  });
});
