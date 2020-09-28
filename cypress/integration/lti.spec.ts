import { findOneCollectionId } from '../../setup/api/collectionApi';
import { findOneVideoId } from '../../setup/api/videoApi';
import { ltiCollectionFixture } from '../../setup/fixture/collections';
import { getParametrisedVideoFixtures } from '../../setup/fixture/videos';
import { generateToken } from '../../setup/generateToken';

import { LtiToolConsumerEmulatorPage } from '../page_objects/lti/LtiToolConsumerEmulatorPage';

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
  it('Launching a single video', () => {
    new LtiToolConsumerEmulatorPage()
      .visit()
      .provideLaunchRequestData(`/videos/${videoId}`)
      .saveData()
      .launchToolProvider()
      .hasLoadedBoclipsPlayer();
  });

  it('Launching a collection of videos', () => {
    new LtiToolConsumerEmulatorPage()
      .visit()
      .provideLaunchRequestData(`/collections/${collectionId}`)
      .saveData()
      .launchToolProvider()
      .hasLoadedCollectionsPage()
      .withCollectionTitle(ltiCollectionFixture.title)
      .selectFirstVideoTile()
      .hasLoadedBoclipsPlayer();
  });

  it('Launching a collections landing page', () => {
    new LtiToolConsumerEmulatorPage()
      .visit()
      .provideLaunchRequestData('/collections')
      .saveData()
      .launchToolProvider()
      .hasLoadedCollectionsLandingPage()
      .withNumberOfCollections(1)
      .selectFirstCollectionTile()
      .hasLoadedCollectionsPage()
      .withCollectionTitle(ltiCollectionFixture.title)
      .selectFirstVideoTile()
      .hasLoadedBoclipsPlayer();
  });
});
