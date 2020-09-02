// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import 'cypress-axe'
import '@testing-library/cypress/add-commands';

const axeSource = require('axe-core').default;

/**
 * This is inspired by the cypress-axe command checkA11y. This helper however will take a threshold and also inject
 * axe javascript into the page.
 */
Cypress.Commands.add('checkA11y', (threshold = 0, context = undefined, options = undefined) => {
  cy.window({log: false})
    .then(win => {
      if (typeof win.axe === 'undefined') {
        win.eval(axeSource)
      }

      if(!win.document) {
        throw Error('commands.js: win.document does not exist!');
      }

      return win.axe.run(context || win.document, options)
    })
    .then((results) => {
      const violations = results.violations;

      if (violations.length) {
        cy.wrap(violations, {log: false}).each(violation => {
          Cypress.log({
            name: 'a11y error!',
            consoleProps: () => violation,
            message: `${violation.id} on ${violation.nodes.length} Node${
              violation.nodes.length === 1 ? '' : 's'
              }: ${violation.nodes.map(node => node.target.join(', ')).join(', ')}`
          })
        })
      }

      return cy.wrap(violations, {log: false})
    })
    .then(violations => {
      assert.isAtMost(
        violations.length,
        threshold,
        `${violations.length} accessibility violation${
          violations.length === 1 ? '' : 's'
          } ${violations.length === 1 ? 'was' : 'were'} detected`
      );
    })
});
