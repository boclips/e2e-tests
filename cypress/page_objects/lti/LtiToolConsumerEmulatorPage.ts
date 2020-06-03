import { By } from '../../support/By';

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
    cy.get('[name="key"]')
      .clear()
      .type(Cypress.env('LTI_CONSUMER_KEY'));
    cy.get('[name="secret"]')
      .clear()
      .type(Cypress.env('LTI_CONSUMER_SECRET'));

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
    this.withinIframe(
      By.dataBoclipsPlayerInitialised(),
      (initialisedPlayer: Cypress.Chainable) =>
        initialisedPlayer.should('be.visible'),
    );

    this.withinIframe(
      By.boclipsPlayerPlayButton(),
      (errorOverlay: Cypress.Chainable) => errorOverlay.should('be.visible'),
    );

    return this;
  }

  public hasLoadedCollectionsPage() {
    this.withinIframe(
      By.dataQa('collectionTitle'),
      (collectionTitle: Cypress.Chainable) =>
        collectionTitle.should('be.visible'),
    );

    return this;
  }

  public withCollectionTitle(title: string) {
    this.withinIframe(
      By.dataQa('collectionTitle'),
      (collectionTitle: Cypress.Chainable) =>
        collectionTitle.should('contain', title),
    );

    return this;
  }

  public hasLoadedCollectionsLandingPage() {
    this.withinIframe(
      By.dataQa('collectionTile'),
      (collectionTitle: Cypress.Chainable) =>
        collectionTitle.should('be.visible'),
    );

    return this;
  }

  public withNumberOfCollections(count: number) {
    this.withinIframe(
      By.dataQa('collectionTile'),
      (videoTiles: Cypress.Chainable) =>
        videoTiles.should('have.length', count),
    );

    return this;
  }

  public selectFirstVideoTile() {
    this.withinIframe(By.dataQa('videoTile'), (videoTiles: Cypress.Chainable) =>
      videoTiles.first().click(),
    );

    return this;
  }

  public selectFirstCollectionTile() {
    this.withinIframe(
      By.dataQa('collectionTile'),
      (videoTiles: Cypress.Chainable) => videoTiles.first().click(),
    );

    return this;
  }

  private withinIframe(
    selector: string,
    handleElement: (element: Cypress.Chainable) => void,
  ) {
    cy.get('iframe')
      .then({ timeout: 30000 }, iframe => {
        return new Promise(resolve => {
          const intervalHandle = setInterval(() => {
            const isElementRendered =
              iframe.contents().find(selector).length > 0;
            if (isElementRendered) {
              clearInterval(intervalHandle);
              resolve(iframe.contents().find('body')[0]);
            }
          }, 100);
        });
      })
      .then(loadedIframeBody => {
        handleElement(cy.wrap(loadedIframeBody).find(selector));
      });

    return this;
  }
}
