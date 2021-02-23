import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../../page_objects/teachers';
import { clearLoginCookies } from '../../page_objects/teachers/CookiesUtils';

context('Teachers App', () => {
  it('registering an account and onboards a user after login', () => {
    const homepage = new TeachersHomepage();
    const username = `${getUniqueText()}@boclips.com`;
    const password = `${getUniqueText()}Aa1$`;

    clearLoginCookies();

    homepage
      .configureHubspotCookie()
      .visitRegistrationPage()
      .createAccount(username, password);

    homepage.activateAccount().accountActivated();
  });

  it('Using search with a query', () => {
    const homepage = new TeachersHomepage();
    const searchQuery = 'Minute Physics';

    clearLoginCookies();

    homepage.visit().logIn();

    if (cy.get('[data-qa="onboarding-section-0"]')) {
      homepage.activateAccount().accountActivated();
    }

    homepage.menu().search(searchQuery);

    cy.contains('Richard St. John: 8 secrets of success');
  });

  it('Using search with a query, applies filters and removes filter', () => {
    const homepage = new TeachersHomepage();
    const searchQuery = 'Minute Physics';
    const subjectFilter = 'Biology';

    clearLoginCookies();

    homepage.visit().logIn();

    if (cy.get('[data-qa="onboarding-section-0"]')) {
      homepage.activateAccount().accountActivated();
    }

    homepage.menu().search(searchQuery);

    homepage
      .applySubjectFilter(subjectFilter)
      .searchResultsHtmlElements()
      .should('have.length', 3);

    homepage
      .removeFilterTag(subjectFilter)
      .searchResultsHtmlElements()
      .should('have.length', 10);

    homepage
      .applyDurationFilter('0m - 2m')
      .searchResultsHtmlElements()
      .should('have.length', 8);
  });

  it('saves a collection and removes the collection from saved', () => {
    const homepage = new TeachersHomepage();
    const searchQuery = 'Minute Physics';
    const fixtureCollectionTitle = 'Minute Physics';

    clearLoginCookies();

    homepage.visit().logIn();

    if (cy.get('[data-qa="onboarding-section-0"]')) {
      homepage.activateAccount().accountActivated();
    }

    homepage
      .menu()
      .search(searchQuery)
      .saveCollection(fixtureCollectionTitle)
      .menu()
      .checkSavedCollectionInMyResources(fixtureCollectionTitle, true)
      .goToHomepage()
      .removeCollectionFromSaved(fixtureCollectionTitle)
      .menu()
      .checkSavedCollectionInMyResources(fixtureCollectionTitle, false)
      .goToHomepage();
  });

  it('saving videos to a collection and editing it', () => {
    const homepage = new TeachersHomepage();
    const fixtureCollectionTitle = 'Minute Physics';
    const collectionTitle = getUniqueText();
    const subject = 'Biology';
    const newCollectionTitle = getUniqueText();

    clearLoginCookies();

    homepage.visit().logIn();

    if (cy.get('[data-qa="onboarding-section-0"]')) {
      homepage.activateAccount().accountActivated();
    }

    homepage
      .menu()
      .search(fixtureCollectionTitle)
      .createCollectionFromVideo(0, collectionTitle)
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
