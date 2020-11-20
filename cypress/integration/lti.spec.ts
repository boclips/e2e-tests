import { findOneCollectionId } from '../../setup/api/collectionApi';
import { findOneVideoId } from '../../setup/api/videoApi';
import { ltiCollectionFixture } from '../../setup/fixture/collections';
import { getParametrisedVideoFixtures } from '../../setup/fixture/videos';
import { generateToken } from '../../setup/generateToken';
import 'cypress-iframe';

import { By } from '../support/By';

let token: string;

let videoId: string;
let collectionId: string;

beforeEach(() => {
  return generateToken()
    .then(async (freshToken: string) => {
      token = freshToken;
      await getParametrisedVideoFixtures(freshToken);
      return findOneVideoId(' ', token);
    })
    .then((returnedVideoId: string) => {
      videoId = returnedVideoId;
    })
    .then(async () => {
      collectionId = (await findOneCollectionId(
        ltiCollectionFixture.title,
        token,
      )) as string;
    });
});

context('LTI', () => {
  it('Launching single video, collection and collections', () => {
    cy.visit(Cypress.env('LTI_TOOL_CONSUMER_EMULATOR_URL'));
    cy.get('[name="key"]').clear().type(Cypress.env('LTI_CONSUMER_KEY'));
    cy.get('[name="secret"]').clear().type(Cypress.env('LTI_CONSUMER_SECRET'));

    cy.log('Launching single video resource');
    launchResource(`/videos/${videoId}`);
    cy.iframe().find(By.dataBoclipsPlayerInitialised()).should('be.visible');
    cy.iframe().find(By.boclipsPlayerPlayButton()).should('be.visible');

    cy.log('Launching collection resource');
    cy.get('[id="reset_top"]').select('full');
    launchResource(`/collections/${collectionId}`);
    cy.iframe()
      .find(By.dataQa('collectionTitle'))
      .should('be.visible')
      .and('contain', ltiCollectionFixture.title);
    cy.iframe().find(By.dataQa('videoTile')).first().click().wait(1000);
    cy.iframe().find(By.dataBoclipsPlayerInitialised()).should('be.visible');
    cy.iframe().find(By.boclipsPlayerPlayButton()).should('be.visible');

    cy.log('Launching collections resource');
    cy.get('[id="reset_top"]').select('full');
    launchResource('/collections');
    cy.iframe()
      .find(By.dataQa('collectionTile'))
      .should('be.visible')
      .and('have.length', 1)
      .first()
      .click()
      .wait(1000);
    cy.iframe()
      .find(By.dataQa('collectionTitle'))
      .should('be.visible')
      .and('contain', ltiCollectionFixture.title);
    cy.iframe().find(By.dataQa('videoTile')).should('be.visible');
  });

  const launchResource = (resourcePath: string) => {
    cy.get('[name="endpoint"]')
      .should('be.visible')
      .clear()
      .type(`${Cypress.env('LTI_LAUNCH_URL')}${resourcePath}`);
    cy.get('[id="save_top"]').click();
    cy.get('[id=launch_top]').click();
    cy.frameLoaded();
  };
});
