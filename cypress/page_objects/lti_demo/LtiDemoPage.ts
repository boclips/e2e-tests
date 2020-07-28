import { withinIframe } from './../../support/cypressBoclipsApiWrappers/withinIFrame';
import { By } from '../../support/By';

export class LtiDemoPage {
  private readonly url: string;

  constructor() {
    this.url = Cypress.env('LTI_DEMO_BASE_URL');
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public logIn() {
    cy.get('#username').type(Cypress.env('BACKOFFICE_USERNAME'));
    cy.get('#password').type(Cypress.env('BACKOFFICE_PASSWORD'));
    cy.get('#kc-form-login').submit();
    return this;
  }

  public getResource() {
    cy.get('#select-resource-button').click();
    cy.wait(5000);
    cy.get('iframe#lti-resource').then((it) => {
      const tiles = (it.contents()[0] as Document).querySelectorAll(
        '.collectionTile',
      );
      expect(tiles).to.have.length(1);
    });
  }

  public getSearchAndEmbedResource() {
    cy.get('#resource-select').select('/search-and-embed');
    cy.get('#select-resource-button').click();

    return this;
  }

  public searchVideo() {
    withinIframe(By.dataQa('search-input'), (search) => {
      search.type('Minute');
    });

    withinIframe(By.dataQa('search-button'), (searchButton) => {
      searchButton.click();
    });

    withinIframe('button:contains("+ Add to lesson")', (videos) => {
      videos.first().click();
    });

    cy.get(By.dataQa('deep-links-header')).should('be.visible');

    withinIframe(
      By.dataBoclipsPlayerInitialised(),
      (initialisedPlayer: Cypress.Chainable) =>
        initialisedPlayer.should('be.visible'),
    );

    withinIframe(
      By.boclipsPlayerPlayButton(),
      (errorOverlay: Cypress.Chainable) => errorOverlay.should('be.visible'),
    );

    return this;
  }
}
