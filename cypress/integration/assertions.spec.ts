import faker from 'faker';

import { dom, NUMBER, WORD } from '@swimlane/cy-dom-diff'

const TIME = /\d?\d:\d?\d\:\d?\d/;

describe('cypress assertions', () => {
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
    cy.get('#test-1').should('domMatch', dom`<h1>Hello World</h1>`);
    cy.get('#test-2').should('domMatch', dom`<h1>Hello <span class="random-number">${NUMBER}</span></h1>`);
    cy.get('#test-3').should('domMatch', dom`<h1>Hello <span class="random-word">${WORD}</span></h1>`);

    cy.get('#clock').should('domMatch', dom`
      <span>The current time is:</span>
      <span class="clock">${TIME} ${/[AP]/}M</span>
      <span class="offset">${NUMBER}</span> hrs
    `);
  });

  it('not matches', () => {
    cy.get('#test-1').should('not.domMatch', dom`<h1>Hello Earth</h1>`);
    cy.get('#test-2').should('not.domMatch', dom`<h1>Goodbye <span class="random-number">${NUMBER}</span></h1>`);
    cy.get('#test-3').should('not.domMatch', dom`<h1>Goodbye <span class="random-word">${WORD}</span></h1>`);

    cy.get('#clock').should('not.domMatch', dom`<span>The current time is:</span>\n<span class="clock"></span> <span class="offset">${NUMBER}</span> hrs`);
  });

  it('fails on static differences', () => {
    cy.fails(() => {
      cy.get('#test-1', { timeout: 0 }).should('domMatch', dom`<h1>Hello Earth</h1>`);
    }, `expected '<h1>\\n  Hello World\\n</h1>\\n' to match /^<h1>\\n  Hello Earth\\n<\\/h1>\\n$/`);
  });

  it('fails on regex differences', () => {
    cy.fails(() => {
      cy.get('#test-1', { timeout: 0 }).should('domMatch', dom`<h1>Hello ${NUMBER}</h1>`);
    }, `expected '<h1>\\n  Hello World\\n</h1>\\n' to match /^<h1>\\n  Hello [\\+\\-]?\\d*\\.?\\d+(?:[Ee][\\+\\-]?\\d+)?\\n<\\/h1>\\n$/`);
  });

  it('fails on not domMatch', () => {
    cy.fails(() => {
      cy.get('#test-1', { timeout: 0 }).should('not.domMatch', dom`<h1>Hello ${WORD}</h1>`);
    }, `expected '<h1>\\n  Hello World\\n</h1>\\n' not to match /^<h1>\\n  Hello [\\w\\-]+\\n<\\/h1>\\n$/`);
  });

  it('retries', () => {
    cy.get('#test-7').within(() => {
      cy.get('#hello').should('domMatch', /Hello World/);
      cy.get('button').click();
      cy.get('#hello').should('domMatch', /Goodbye Earth/);
    });
  });
});
