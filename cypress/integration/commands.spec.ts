// tslint:disable-next-line: no-reference
/// <reference path="../../src/types/main.d.ts" />

import faker from 'faker';

// tslint:disable-next-line: no-implicit-dependencies
import { html, NUMBER, WORD } from '@swimlane/cy-dom-diff';

const NGCLASS = /c\d\d-\d/;
const UUID = /[a-z0-9]+/;
const USER = /[a-zA-Z0-9]+/;
const TIME = /\d?\d:\d?\d\:\d?\d/;

describe('cypress command', () => {
  before(() => {
    cy.visit('index.html');
    cy.get('.random-number').then($el => {
      $el.text(faker.random.number());
    });
    cy.get('.random-word').then($el => {
      $el.text(faker.random.word());
    });
  });

  it('matches', () => {
    cy.get('#test-1').domMatch(html`<h1>Hello World</h1>`);
    cy.get('#test-2').domMatch(html`<h1>Hello <span class="random-number">${NUMBER}</span></h1>`);
    cy.get('#test-3').domMatch(html`<h1>Hello <span class="random-word">${WORD}</span></h1>`);

    cy.get('#clock').domMatch(html`
    <span>The current time is:</span>
    <span class="clock">${TIME} ${/[AP]/}M</span>
    <span class="offset">${NUMBER}</span> hrs`);

    cy.get('#test-6').domMatch(html`
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

  it.only('uses options', () => {
    cy.get('#test-6').domMatch(html`
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
      cy.get('#test-5').domMatch(html`<h1>Goodbye ${WORD}</h1><h1>Hello ${NUMBER}</h1>`, { timeout: 0 });
    }, 'to match');
  });

  it('fails 2', () => {
    cy.fails(() => {
      cy.get('#test-6').domMatch(html`
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
      cy.get('#test-5').domMatch(html`<h1>Goodbye ${WORD}</h1><h1>Hello ${NUMBER}</h1>`, 'this should match', { timeout: 0 });
    }, 'this should match');
  });
});
