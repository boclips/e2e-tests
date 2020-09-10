export const withinIframe = (
  selector: string,
  handleElement: (element: Cypress.Chainable) => void,
) => {
  cy.get('iframe')
    .then({ timeout: 120000 }, (iframe) => {
      return new Promise((resolve) => {
        const intervalHandle = setInterval(() => {
          const isElementRendered = iframe.contents().find(selector).length > 0;
          if (isElementRendered) {
            clearInterval(intervalHandle);
            resolve(iframe.contents().find('body')[0]);
          }
        }, 100);
      });
    })
    .then((loadedIframeBody) => {
      handleElement(cy.wrap(loadedIframeBody).find(selector));
    });
};
