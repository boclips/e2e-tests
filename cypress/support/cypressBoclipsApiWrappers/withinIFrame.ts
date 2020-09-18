// Inspired by https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/

export const withinIframe = (
  selector: string,
  handleElement: (element: Cypress.Chainable) => void,
) => {
  handleElement(getIframeBody().find(selector));
};

const getIframeBody = () => {
  return cy
    .get('iframe')
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap);
};
