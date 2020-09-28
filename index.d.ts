/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    domDiff(re: RegExp): Chainable<any>
    domMatch(re: RegExp): Chainable<any>
  }
}