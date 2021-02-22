import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../../page_objects/teachers';
import { clearLoginCookies } from '../../page_objects/teachers/CookiesUtils';

context('Teachers App Collections Journey', () => {
  specify('collection interactions are successful', () => {
    const homepage = new TeachersHomepage();
    const username = `${getUniqueText()}@boclips.com`;
    const password = `${getUniqueText()}Aa1$`;
    const subject = 'Biology';
    const fixtureCollectionTitle = 'Minute Physics';
    const collectionTitle = getUniqueText();
    const newCollectionTitle = getUniqueText();
    const searchQuery = 'Minute Physics';
    const subjectFilter = 'Biology';

    clearLoginCookies();

    homepage
      .configureHubspotCookie()

      .log('registering an account')
      .visitRegistrationPage()
      .createAccount(username, password)

      .log('onboarding user after autologin')
      .activateAccount()
      .accountActivated()

      .log('searching videos')
      .menu()
      .search(searchQuery)

      .log('applying subject filter')
      .applySubjectFilter(subjectFilter)
      .inspectResults((subjectVideos) => {
        expect(subjectVideos.length).to.be.eq(
          3,
          `There are three videos showing`,
        );
      })
      .removeFilterTag(subjectFilter)

      .log('applying duration filter')
      .applyDurationFilter('0m - 2m')
      .inspectResults((durationVideos) => {
        expect(durationVideos.length).to.be.eq(
          8,
          `There are eight videos showing`,
        );
      })

      .log('saving a collection made by someone else')
      .menu()
      .goToHomepage()
      .saveCollection(fixtureCollectionTitle)
      .menu()
      .checkSavedCollectionInMyResources(fixtureCollectionTitle, true)
      .goToHomepage()
      .removeCollectionFromSaved(fixtureCollectionTitle)
      .menu()
      .checkSavedCollectionInMyResources(fixtureCollectionTitle, false)
      .goToHomepage()

      .log('saving a video to a new collection')
      .menu()
      .search(fixtureCollectionTitle)
      .createCollectionFromVideo(0, collectionTitle)

      .log('editing the collection')
      .menu()
      .goToCollections()
      .goToCollectionDetails(collectionTitle)
      .then((page) => {
        page
          .log('update collection subject')
          .setSubject(subject)
          .log('update collection title')
          .setName(newCollectionTitle)
          .saveEdit()
          .itHasName(newCollectionTitle)
          .itHasSubject(subject)

          .log('remove video from collection')
          .inspectItems((videos) => expect(videos).to.have.length(1))
          .removeVideo(0)
          .isEmpty();
      });
  });

  const getUniqueText = () => uuid().substr(0, 6);
});
