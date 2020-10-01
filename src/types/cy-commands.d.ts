/// <reference types="cypress" />

declare namespace Cypress {
  type DiffOptions = import('@open-wc/semantic-dom-diff/get-diffable-html').DiffOptions;
  type Options = Partial<Cypress.Loggable & Cypress.Timeoutable & DiffOptions> | undefined

  interface Chainable<Subject> {
    domDiff(re: RegExp, options: Options): Chainable<any>

    domMatch(re: RegExp, message: string | Options): Chainable<any>
    domMatch(re: RegExp, message?: string, options?: Options): Chainable<any>
  }
}
