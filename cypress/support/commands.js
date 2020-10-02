/// <reference path="../../src/types/main.d.ts" />

import '@swimlane/cy-dom-diff/commands';

Cypress.Commands.add('fails', function (fn, message) {
  const failed = `Expected to fail with "${message}"`;
  const passed = `${failed}, but it did not fail`;

  cy.on('fail', (err) => {
    if (err.message === passed) {
      throw err;
    } else if (message) {
      expect(err.message).to.include(message, failed);
    }
    return false;
  });

  fn.call(this);
  cy.then(() => assert(false, passed));
});