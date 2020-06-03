import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../../page_objects/teachers';
import {
  clearLoginCookies,
  preserveLoginCookiesBetweenTests,
} from '../../page_objects/teachers/CookiesUtils';

context('Teachers App Collections Journey', () => {
  const homepage = new TeachersHomepage();

  const username = `${uuid()}@boclips.com`;
  const password = `${uuid()}Aa1$`;

  const MINUTE_PHYSICS = 'Minute Physics';
  const SUBJECT = 'Biology';

  const existingPublicCollectionTitle = MINUTE_PHYSICS;

  before(() => {
    clearLoginCookies();
    homepage
      .configureHubspotCookie()
      .log('creating an account')
      .visitRegistrationPage()
      .createAccount(username, password)
      .accountCreated()

      .log('logging in')
      .visit()
      .logIn(username, password)

      .log('activating account')
      .activateAccount()
      .accountActivated();
  });

  beforeEach(preserveLoginCookiesBetweenTests);

  specify('Bookmarking', () => {
    homepage
      .visit()
      .bookmarkCollection(existingPublicCollectionTitle)
      .unbookmarkCollection(existingPublicCollectionTitle)
      .bookmarkCollection(existingPublicCollectionTitle)

      .menu()
      .goToBookmarkedCollections()
      .goToHomepage()
      .reload()
      .checkCollectionBookmarkStatus(existingPublicCollectionTitle, true);
  });

  specify('Create a collection with a video', () => {
    const collectionTitle = uuid();

    homepage
      .menu()
      .search(MINUTE_PHYSICS)
      .createCollectionFromVideo(0, collectionTitle)
      .isVideoInCollection(0, collectionTitle);
  });

  specify('Remove a video on search page', () => {
    const collectionTitle = uuid();

    homepage
      .menu()
      .search(MINUTE_PHYSICS)
      .createCollectionFromVideo(0, collectionTitle)

      .isVideoInCollection(0, collectionTitle)
      .reload()
      .removeVideoFromCollection(0, collectionTitle)
      .isVideoInCollection(0, collectionTitle, false);
  });

  specify('Remove a video on collection page', () => {
    const collectionTitle = uuid();

    homepage
      .menu()
      .search(MINUTE_PHYSICS)
      .createCollectionFromVideo(0, collectionTitle)

      .menu()
      .goToCollections()
      .goToCollectionDetails(collectionTitle)
      .then(page => {
        page
          .inspectItems(videos => expect(videos).to.have.length(1))
          .removeVideo(0)
          .isEmpty();
      });
  });

  specify('Editing a collection', () => {
    const collectionTitle = uuid();
    const newCollectionTitle = uuid();

    homepage
      .menu()
      .search(MINUTE_PHYSICS)
      .createCollectionFromVideo(0, collectionTitle)

      .menu()
      .goToCollections()
      .goToCollectionDetails(collectionTitle)
      .then(page => {
        page
          .setSubject(SUBJECT)
          .setName(newCollectionTitle)
          .itHasName(newCollectionTitle);
      });
  });

  specify('Can delete a collection', () => {
    const collectionTitle = uuid();
    let collectionCount: number;
    homepage
      .menu()
      .search(MINUTE_PHYSICS)
      .createCollectionFromVideo(0, collectionTitle)

      .menu()
      .goToCollections()
      .inspectCollections(collections => (collectionCount = collections.length))
      .deleteCollection(collectionTitle);
  });

  specify('Curated collections are discoverable by subject', () => {
    homepage
      .menu()
      .goToHomepage()
      .goToDiscoverBySubject(SUBJECT)
      .containsCollections();
  });
});
