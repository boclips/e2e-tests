import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../../page_objects/teachers';
import { clearLoginCookies } from '../../page_objects/teachers/CookiesUtils';

context('Teachers App Collections Journey', () => {
  specify('collection interactions are successful', () => {
    const homepage = new TeachersHomepage();
    const username = `${uuid()}@boclips.com`;
    const password = `${uuid()}Aa1$`;
    const subject = 'Biology';
    const fixtureCollectionTitle = 'Minute Physics';
    const collectionTitle = uuid();
    const newCollectionTitle = uuid();

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
      .accountActivated()

      .log('Curated collections are discoverable by subject')
      .goToSubjectSearchPage(subject)
      .containsCollections()

      .log('Bookmarking')
      .menu()
      .goToHomepage()
      .bookmarkCollection(fixtureCollectionTitle)
      .unbookmarkCollection(fixtureCollectionTitle)
      .bookmarkCollection(fixtureCollectionTitle)
      .menu()
      .goToBookmarkedCollections()
      .goToHomepage()
      .reload()
      .checkCollectionBookmarkStatus(fixtureCollectionTitle, true)

      .log('Create a new collection with a video')
      .menu()
      .search(fixtureCollectionTitle)
      .createCollectionFromVideo(0, collectionTitle)
      .isVideoInCollection(0, collectionTitle)

      .log('Remove a video from that collection on search results page')
      .menu()
      .search(fixtureCollectionTitle)
      .removeVideoFromCollection(0, collectionTitle)
      .isVideoInCollection(0, collectionTitle, false)

      .log('delete the collection')
      .menu()
      .goToCollections()
      .inspectCollections((collections) => collections.length)
      .deleteCollection(collectionTitle)

      .log('create new collection then remove a video on collection page')
      .menu()
      .search(fixtureCollectionTitle)
      .createCollectionFromVideo(0, collectionTitle)
      .menu()
      .goToCollections()
      .goToCollectionDetails(collectionTitle)
      .then((page) => {
        page
          .log('update collection title and subject')
          .setSubject(subject)
          .setName(newCollectionTitle)
          .itHasName(newCollectionTitle)
          .inspectItems((videos) => expect(videos).to.have.length(1))
          .removeVideo(0)
          .isEmpty();
      });
  });
});
