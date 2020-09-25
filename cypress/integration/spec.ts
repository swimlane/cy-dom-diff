
import faker from 'faker';

import { chaiDomMatch } from '../../src/assertion';
import { str, json, html } from '../../src/matchers';
import { NUMBER, WORD, PROP, VALUES } from '../../src/regexps'

chai.use(chaiDomMatch);

const TIME = /\d?\d:\d?\d\:\d?\d/;

describe('test', () => {
  before(() => {
    cy.visit('index.html');
    cy.get('.random-number').then($el => {
      $el.text(faker.random.number());
    });
    cy.get('.random-word').then($el => {
      $el.text(faker.random.word());
    });
  });

  it('strings', () => {
    cy.wrap('Hello World').should('match', str`Hello World`);
    cy.wrap('Hello World').should('match', str`Hello World`);
    cy.wrap(`Hello ${faker.random.number()}`).should('match', str`Hello ${NUMBER}`);
    cy.wrap(`Hello ${faker.random.word()}`).should('match', str`Hello ${WORD}`);
  });

  it('json', () => {
    cy.wrap({ hello: 'world' }).should('match', json`{ "hello": "world" }`);
    cy.wrap({ hello: faker.random.number() }).should('match', json`{ "hello": ${NUMBER} }`);
    cy.wrap({ hello: '' + faker.random.word() }).should('match', json`{ "hello": "${WORD}" }`);
  });

  it('html', () => {
    cy.get('#test-1').should('match', html`<h1>Hello World</h1>`);
    cy.get('#test-3').should('match', html`<h1>Hello <span class="random-word">${WORD}</span></h1>`);
    cy.get('#test-2').should('match', html`<h1>Hello <span class="random-number">${NUMBER}</span></h1>`);

    cy.get('#test-4').should('match', html`<h1 ${PROP}="${VALUES}">Hello World</h1>`);
    // cy.get('#test-4').should('match', html`<h1 ${ATTR}>Hello World</h1>`);
    // cy.get('#test-4').should('match', html`<h1 ${ATTRS}>Hello World</h1>`);

    // cy.get('#test-1').should('match', html`<${HEADING}>Hello World</${HEADING}>`);

    cy.get('.fancy-clock #clock').should('not.to.be.empty');
    cy.get('.fancy-clock').should('match', html`<span>The currrent time is:</span>\n<span id="clock">${TIME} ${/[AP]/}M</span> <span id="offset">${NUMBER}</span> hrs`);
  });

  it('text', () => {
    cy.get('#test-1').should('match', str`Hello World`);
    cy.get('#test-3').should('match', str`Hello ${WORD}`);
    cy.get('#test-2').should('match', str`Hello ${NUMBER}`);
  });

  it.skip('failing', () => {
    cy.wrap('Hello World').should('match', str`Hello Earth`);
    // cy.wrap({ hello: 'world' }).should('match', json`{ "hello": "Earth" }`);
    // cy.get('#test-1').should('match', html`<h3>Hello World</h3>`);
  });

  it('failing with pattern', () => {
    // cy.wrap('Goodbye World').should('match', str`Hello ${WORD}`);
    // cy.wrap({ Goodbye: 'world' }).should('match', json`{ "hello": "${WORD}" }`);
    cy.get('#test-1').should('match', html`<h3>Hello ${WORD}</h3>`);
  });
});