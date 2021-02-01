// tslint:disable-next-line: no-reference
/// <reference path="../../src/types/main.d.ts" />

import faker from 'faker';

import { dom } from '@swimlane/dom-diff';
import { NUMBER, WORD } from '@swimlane/cy-dom-diff';

const NGCLASS = /c\d\d-\d/;
const UUID = /[a-z0-9]+/;
const USER = /[a-zA-Z0-9]+/;
const TIME = /\d?\d:\d?\d\:\d?\d/;

describe('cypress commands', () => {
  before(() => {
    cy.visit('index.html');
    cy.get('.random-number').then($el => {
      $el.text(faker.random.number());
    });
    cy.get('.random-word').then($el => {
      $el.text(faker.random.word());
    });
  });

  describe('domDiff', () => {
    it('matches', (done) => {
      cy.on('log:added', (log) => {
        if (log.name === 'domDiff') {
          expect(log.state).to.equal('passed');
          expect(log.consoleProps.Actual).equals('<h1>\n  Hello World\n</h1>');
          expect(log.consoleProps.Difference).equals('');
          expect(log.consoleProps.Expected).equals('<h1>\n  Hello World\n</h1>');
          done();
        }
      });
      cy.get('#test-1').domDiff(dom`<h1>Hello World</h1>`);
    });

    it(`doesn't match`, (done) => {
      cy.on('log:added', (log) => {
        if (log.name === 'domDiff') {
          expect(log.state).to.equal('failed');
          expect(log.consoleProps.Actual).equals('<h1>\n  Hello World\n</h1>');
          expect(log.consoleProps.Difference).equals('<h1>\n-  Hello Earth\n+  Hello World\n </h1>');
          expect(log.consoleProps.Expected).equals('<h1>\n  Hello Earth\n</h1>');
          done()
        }
      });
      cy.get('#test-1').domDiff(dom`<h1>Hello Earth</h1>`);
    });

    it(`doesn't match regex portion`, (done) => {
      cy.on('log:added', (log) => {
        if (log.name === 'domDiff') {
          expect(log.state).to.equal('failed');
          expect(log.consoleProps.Actual).equals('<h1>\n  Hello World\n</h1>');
          expect(log.consoleProps.Difference).equals('<h1>\n-  Hello \${/\\d+/}\n+  Hello World\n </h1>');
          expect(log.consoleProps.Expected).equals('<h1>\n  Hello \${/\\d+/}\n</h1>');
          done();
        }
      });
      cy.get('#test-1').domDiff(dom`<h1>Hello ${/\d+/}</h1>`);
    });

    it(`doesn't match regex`, (done) => {
      cy.on('log:added', (log) => {
        if (log.name === 'domDiff') {
          expect(log.state).to.equal('failed');
          expect(log.consoleProps.Actual).equals('<h1>\n  Hello World\n</h1>');
          expect(log.consoleProps.Difference).equals(undefined);
          expect(log.consoleProps.Expected).deep.equals(/Hello Earth/);
          done();
        }
      });
      cy.get('#test-1').domDiff(/Hello Earth/);
    });

    it(`can dom diff on empty dom`, (done) => {
      cy.on('log:added', (log) => {
        if (log.name === 'domDiff') {
          expect(log.state).to.equal('failed');
          expect(log.consoleProps.Actual).equals('<h1>\n  Hello World\n</h1>');
          expect(log.consoleProps.Difference).equals('+<h1>\n+  Hello World\n+</h1>');
          expect(log.consoleProps.Expected).equals('');
          done();
        }
      });
      cy.get('#test-1').domDiff(dom``);
    });

    it(`can dom diff on nothing`, (done) => {
      cy.on('log:added', (log) => {
        if (log.name === 'domDiff') {
          expect(log.state).to.equal('failed');
          expect(log.consoleProps.Actual).equals('<h1>\n  Hello World\n</h1>');
          expect(log.consoleProps.Difference).equals(undefined);
          expect(log.consoleProps.Expected).deep.equals(undefined);
          done();
        }
      });
      cy.get('#test-1').domDiff();
    });
  });

  describe('domMatch', () => {
    it('adds log', (done) => {
      cy.on('log:added', (log) => {
        if (log.name === 'domMatch') {
          expect(log.consoleProps.Actual).equals('<h1>\n  Hello World\n</h1>');
          expect(log.consoleProps.Difference).equals('');
          expect(log.consoleProps.Expected).equals('<h1>\n  Hello World\n</h1>');
          done();
        }
      });
      cy.get('#test-1').domMatch(dom`<h1>Hello World</h1>`);
    });

    it(`adds log on failed match`, (done) => {
      cy.on('log:added', (log) => {
        if (log.name === 'domMatch') {
          expect(log.consoleProps.Actual).equals('<h1>\n  Hello World\n</h1>');
          expect(log.consoleProps.Difference).equals('<h1>\n-  Hello Earth\n+  Hello World\n </h1>');
          expect(log.consoleProps.Expected).equals('<h1>\n  Hello Earth\n</h1>');
          done();
        }
      });

      cy.fails(() => {
        cy.get('#test-1').domMatch(dom`<h1>Hello Earth</h1>`, { timeout: 0 });
      });
    });

    it('matches', () => {
      cy.get('#test-2').domMatch(dom`<h1>Hello <span class="random-number">${NUMBER}</span></h1>`);
      cy.get('#test-3').domMatch(dom`<h1>Hello <span class="random-word">${WORD}</span></h1>`);
  
      cy.get('#clock').domMatch(dom`
      <span>The current time is:</span>
      <span class="clock">${TIME} ${/[AP]/}M</span>
      <span class="offset">${NUMBER}</span> hrs`);
  
      cy.get('#test-6').domMatch(dom`
        <div
            class="ng-star-inserted ng-tns-${NGCLASS} ng-trigger ng-trigger-stepAnimation"
            style="transform: translate3d(0px, 0px, 0px); opacity: 1;">
          <img
            class="logo"
            src="./${UUID}.png">
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

    it('handles multiple assertions', () => {
      let count = 0;

      cy.on('log:added', (log) => {
        if (log.name === 'domMatch') {
          count++;
        }
      });

      cy.get('#test-1').domMatch(dom`<h1>Hello World</h1>`);
      cy.get('#test-2').domMatch(dom`<h1>Hello <span class="random-number">${NUMBER}</span></h1>`);
      cy.get('#test-3').domMatch(dom`<h1>Hello <span class="random-word">${WORD}</span></h1>`);

      cy.then(() => {
        expect(count).to.equal(3);
      });
    });

    it('handles multiple assertions, one failed', () => {
      let count = 0;

      cy.on('log:added', (log) => {
        if (log.name === 'domMatch') {
          count++;
        }
      });

      cy.fails(() => {
        cy.get('#test-1').domMatch(dom`<h1>Hello World</h1>`);
        cy.get('#test-2').domMatch(dom`<h1>Hello <span class="random-number">${NUMBER}</span></h1>`);
        cy.get('#test-3').domMatch(dom`<h1>Hello <span class="random-word">${WORD}</span></h1>`);
        cy.get('#test-1').domMatch(dom`<h1>Hello Earth</h1>`, { timeout: 0 });
      }).then(() => {
        expect(count).to.equal(4);
      });
    });
  
    it('can match against regexp', () => {
      cy.get('#test-1').domMatch(/Hello World/);
    });
  
    it('can match against empty html', () => {
      cy.fails(() => {
        cy.get('#test-1').domMatch(dom``, { timeout: 0 });
      });
    });
  
    it('uses options', () => {
      cy.get('#test-6').domMatch(dom`
        <div
            class="ng-star-inserted ng-tns-${NGCLASS} ng-trigger ng-trigger-stepAnimation"
            style="transform: translate3d(0px, 0px, 0px); opacity: 1;">
          <img
            class="logo"
            src="./${UUID}.png">
          <h1 class="ng-tns-${NGCLASS}">
            Welcome, ${USER}!
          </h1>
          <div class="subtext">
            Let's start.
          </div>
          <a
            class="btn btn-primary"
            href="/apps"
            uisref="apps">
            Start Building
          </a>
        </div>
      `, { ignoreAttributes: ['ng-reflect-state'] });
    });
  
    it('fails 1', () => {
      cy.fails(() => {
        cy.get('#test-5').domMatch(dom`<h1>Goodbye ${WORD}</h1><h1>Hello ${NUMBER}</h1>`, { timeout: 0 });
      }, 'to match');
    });
  
    it('fails 2', () => {
      cy.fails(() => {
        cy.get('#test-6').domMatch(dom`
        <div
            class="ng-star-inserted ng-tns-${NGCLASS} ng-trigger ng-trigger-stepAnimation"
            style="transform: translate3d(0px, 0px, 0px); opacity: 1;">
          <img
            class="logo"
            src="/${UUID}.png">
          <h1 class="ng-${NGCLASS}">
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
      `, { timeout: 0 });
      }, 'to match');
    });
  
    it('fails with message', () => {
      cy.fails(() => {
        cy.get('#test-5').domMatch(dom`<h1>Goodbye ${WORD}</h1><h1>Hello ${NUMBER}</h1>`, 'this should match', { timeout: 0 });
      }, 'this should match');
    });
  
    it('retries', () => {
      cy.get('#test-7').within(() => {
        cy.get('#hello').domMatch(dom`Hello World`);
        cy.get('button').click();
        cy.get('#hello').domMatch(dom`Goodbye Earth`);
      });
    });
  });
});
