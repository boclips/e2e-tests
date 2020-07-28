import { By } from '../../support/By';
import { withinIframe } from '../../support/cypressBoclipsApiWrappers/withinIFrame';

export class LtiToolConsumerEmulatorPage {
  private readonly url: string;

  constructor() {
    this.url = Cypress.env('LTI_TOOL_CONSUMER_EMULATOR_URL');
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public provideLaunchRequestData(resourcePath: string) {
    cy.get('[name="endpoint"]')
      .clear()
      .type(`${Cypress.env('LTI_LAUNCH_URL')}${resourcePath}`);
    cy.get('[name="key"]').clear().type(Cypress.env('LTI_CONSUMER_KEY'));
    cy.get('[name="secret"]').clear().type(Cypress.env('LTI_CONSUMER_SECRET'));

    return this;
  }

  public saveData() {
    cy.get('[id="save_top"]').click();

    return this;
  }

  public launchToolProvider() {
    cy.get('[id=launch_top]').click();

    return this;
  }

  public hasLoadedBoclipsPlayer() {
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

  public hasLoadedCollectionsPage() {
    withinIframe(
      By.dataQa('collectionTitle'),
      (collectionTitle: Cypress.Chainable) =>
        collectionTitle.should('be.visible'),
    );

    return this;
  }

  public withCollectionTitle(title: string) {
    withinIframe(
      By.dataQa('collectionTitle'),
      (collectionTitle: Cypress.Chainable) =>
        collectionTitle.should('contain', title),
    );

    return this;
  }

  public hasLoadedCollectionsLandingPage() {
    withinIframe(
      By.dataQa('collectionTile'),
      (collectionTitle: Cypress.Chainable) =>
        collectionTitle.should('be.visible'),
    );

    return this;
  }

  public withNumberOfCollections(count: number) {
    withinIframe(By.dataQa('collectionTile'), (videoTiles: Cypress.Chainable) =>
      videoTiles.should('have.length', count),
    );

    return this;
  }

  public selectFirstVideoTile() {
    withinIframe(By.dataQa('videoTile'), (videoTiles: Cypress.Chainable) =>
      videoTiles.first().click(),
    );

    return this;
  }

  public selectFirstCollectionTile() {
    withinIframe(By.dataQa('collectionTile'), (videoTiles: Cypress.Chainable) =>
      videoTiles.first().click(),
    );

    return this;
  }
}
