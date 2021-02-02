/// <reference types="cypress" />

declare namespace Cypress {
  type ProcessorOptions = import('@swimlane/dom-diff').ProcessorOptions;
  type Options =
    | Partial<Cypress.Loggable & Cypress.Timeoutable & ProcessorOptions>
    | undefined;

  interface Chainable<Subject> {
    domDiff(re?: RegExp, options?: Options): Chainable<any>;

    domMatch(re: RegExp, message: string | Options): Chainable<any>;
    domMatch(re: RegExp, message?: string, options?: Options): Chainable<any>;
  }
}
