
import faker from 'faker';

import { chaiDomMatch } from '../../src/assertion';
import { html } from '../../src/matchers';
import { NUMBER, WORD, PROP, VALUES } from '../../src/regexps'

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
      it('contains', () => {
        expect(el).dom.contains('Hello World');
      });

      it('equals', () => {
        expect(el).dom.to.equal('<h1>\n  Hello World\n</h1>\n');
      });

      it('not equals', () => {
        expect(el).dom.to.not.equal('<h1>\n  Hello Earth\n</h1>\n');
      });

      it('matches', () => {
        expect(el).dom.matches(/Hello World/);
        expect(el).dom.matches(html`<h1>Hello World</h1>`);
      });

      it('not matches', () => {
        expect(el).dom.not.matches(/Hello Earth/);
        expect(el).dom.does.not.match(html`<h1>Hello Earth</h1>`);
      });
      
      it('fails', () => {
        cy.fails(() => {
          expect(el).dom.matches(/Hello Earth/);
        }, `expected '<h1>\\n  Hello World\\n</h1>\\n' to match /Hello Earth/`);
      });
    });

    describe('jQuery node', () => {
      it('contains', () => {
        expect($el).dom.contains('Hello World');
      });

      it('equals', () => {
        expect($el).dom.to.equal('<h1>\n  Hello World\n</h1>\n');
      });

      it('not equals', () => {
        expect($el).dom.to.not.equal('<h1>\n  Hello Earth\n</h1>\n');
      });

      it('matches', () => {
        expect($el).dom.matches(/Hello World/);

        expect($el).dom.to.match(html`<h1>Hello World</h1>`);
      });

      it('not matches', () => {
        expect($el).dom.not.matches(/Hello Earth/);
        expect($el).dom.to.not.match(html`<h1>Hello Earth</h1>`);
      });
      
      it('fails', () => {
        cy.fails(() => {
          expect($el).dom.matches(/Hello Earth/);
        }, `expected '<h1>\\n  Hello World\\n</h1>\\n' to match /Hello Earth/`);
      });
    });
  });

  describe('cypress assertions', () => {
    it('equals', () => {
      cy.get('#test-1').should('dom.equals', '<h1>\n  Hello World\n</h1>\n');
    });

    it('not equals', () => {
      cy.get('#test-1').should('not.dom.equals', '<h1>\n  Hello Earth\n</h1>\n');
    });

    it('matches', () => {
      cy.get('#test-1').should('dom.matches', html`<h1>Hello World</h1>`);
      cy.get('#test-2').should('have.dom.that.matches', html`<h1>Hello <span class="random-number">${NUMBER}</span></h1>`);
      cy.get('#test-3').should('dom.to.match', html`<h1>Hello <span class="random-word">${WORD}</span></h1>`);

      cy.get('#clock').should('dom.matches', html`
      <span>The currrent time is:</span>
      <span class="clock">${TIME} ${/[AP]/}M</span>
      <span class="offset">${NUMBER}</span> hrs`);
    });

    it('not matches', () => {
      cy.get('#test-1').should('dom.not.matches', html`<h1>Hello Earth</h1>`);
      cy.get('#test-2').should('have.dom.that.does.not.match', html`<h1>Goodbye <span class="random-number">${NUMBER}</span></h1>`);
      cy.get('#test-3').should('dom.to.not.match', html`<h1>Goodbye <span class="random-word">${WORD}</span></h1>`);

      cy.get('#clock').should('dom.not.matches', html`<span>The currrent time is:</span>\n<span class="clock"></span> <span class="offset">${NUMBER}</span> hrs`);
    });

    it('fails', () => {
      cy.fails(() => {
        cy.get('#test-1').should('dom.matches', html`<h1>Hello Earth</h1>`);
      }, 'to match');

      cy.fails(() => {
        cy.get('#test-1').should('dom.matches', html`<h1>Hello ${NUMBER}</h1>`);
      }, 'to match');
    });
  });

  describe('cypress command', () => {
    it.only('matches', () => {
      cy.get('#test-1').domMatch(html`<h1>Hello World</h1>`);
      cy.get('#test-2').domMatch(html`<h1>Hello <span class="random-number">${NUMBER}</span></h1>`);
      cy.get('#test-3').domMatch(html`<h1>Hello <span class="random-word">${WORD}</span></h1>`);

      cy.get('#clock').domMatch(html`
      <span>The currrent time is:</span>
      <span class="clock">${TIME} ${/[AP]/}M</span>
      <span class="offset">${NUMBER}</span> hrs`);

      const NGCLASS = /c\d\d-\d/;
      const UUID = /[a-z0-9]+/;
      const USER = /[a-zA-Z0-9]+/;

      cy.get('#test-6').domMatch(html`
        <div
            class="ng-star-inserted ng-tns-${NGCLASS} ng-trigger ng-trigger-stepAnimation"
            style="transform: translate3d(0px, 0px, 0px); opacity: 1;">
          <img
            class="logo"
            src="/dist/${UUID}.svg">
          <h1 class="ng-tns-${NGCLASS}">
            Welcome, ${USER}!
          </h1>
          <div class="subtext">
            Let's start.
          </div>
          <a
            class="btn btn-primary"
            href="/apps"
            ng-reflect-state="apps"
            uisref="apps">
            Start Building
          </a>
        </div>
      `);
    });

    it('fails', () => {
      cy.fails(() => {
        cy.get('#test-5').domMatch(html`<h1>Goodbye ${WORD}</h1><h1>Hello ${NUMBER}</h1>`);
      }, 'to match');
    });
  });
});
