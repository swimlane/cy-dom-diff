import faker from 'faker';

import { html } from '../../src/matchers';
import { WORD } from '../../src/regexps';

const TIME = /\d?\d:\d?\d\:\d?\d/;

describe('expect', () => {
  before(() => {
    cy.visit('index.html');
    cy.get('.random-number').then(_ => {
      _.text(faker.random.number());
    });
    cy.get('.random-word').then(_ => {
      _.text(faker.random.word());
    });
  });

  describe('element', () => {
    let el: any;

    before(() => {
      cy.document().then((doc) => {
        el = doc.getElementById('test-1');
      });
    });

    it('matches', () => {
      expect(el).domMatch(html`<h1>Hello World</h1>`);
    });

    it('not matches', () => {
      expect(el).not.domMatch(/Hello Earth/);
      expect(el).not.domMatch(html`<h1>Hello Earth</h1>`);
    });

    it('matches with regex', () => {
      expect(el).domMatch(/Hello World/);
      expect(el).domMatch(html`<h1>Hello ${WORD}</h1>`);
    });
    
    it('fails', () => {
      cy.fails(() => {
        expect(el).domMatch(/Hello Earth/);
      }, `expected '<h1>\\n  Hello World\\n</h1>\\n' to match /Hello Earth/`);
    });

    it.only('fails with message', () => {
      cy.fails(() => {
        expect(el).domMatch(/Hello Earth/, 'this should match', {});
      }, `this should match`);
    });
  });

  describe('jQuery node', () => {
    let $el: any;

    before(() => {
      cy.document().then((doc) => {
        $el = Cypress.$('#test-1');
      });
    });

    it('matches', () => {
      expect($el).domMatch(html`<h1>Hello World</h1>`);
    });

    it('matches with regex', () => {
      expect($el).domMatch(/Hello World/);
      expect($el).domMatch(html`<h1>Hello ${WORD}</h1>`);
    });

    it('not matches', () => {
      expect($el).not.to.domMatch(/Hello Earth/);
      expect($el).not.to.domMatch(html`<h1>Hello Earth</h1>`);
    });

    it('options', () => {
      expect(Cypress.$('#test-6')).domMatch(html`
        <div class="ng-star-inserted ng-tns-c19-5 ng-trigger ng-trigger-stepAnimation">
          <h1 class="ng-tns-c19-5"></h1>
          <div class="subtext">
            Let's start.
          </div>
          <a
            class="btn btn-primary"
            href="/apps"
            uisref="apps"
          >
            Start Building
          </a>
        </div>
      `, { ignoreAttributes: ['ng-reflect-state', { tags: ['div'], attributes: ['style'] }], ignoreChildren: ['h1'], ignoreTags: ['img'] });
    });
    
    it('fails', () => {
      cy.fails(() => {
        expect($el).domMatch(/Hello Earth/);
      }, `expected '<h1>\\n  Hello World\\n</h1>\\n' to match /Hello Earth/`);
    });
  });

});
