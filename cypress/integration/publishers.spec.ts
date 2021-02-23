import { PublishersPage } from '../page_objects/publishers/Publishers';

context('Publishers', () => {
  const publishersPage = new PublishersPage();

  const searchTerm: string = 'Minute Physics';

  it('lands on a homepage', () => {
    publishersPage.visit().login();

    cy.get('.grid').should('be.visible');

    cy.percySnapshot('Home Page', {
      widths: [1280, 1440, 1680],
    });
  });

  it('opens account panel', () => {
    publishersPage.visit().login();

    publishersPage.openAccountPanel();

    cy.percySnapshot('Account panel', {
      widths: [1280, 1440, 1680],
    });
  });

  it('search', () => {
    cy.intercept({
      pathname: '/v1/videos',
      query: {
        query: 'Minute Physics',
      },
    }).as('search');

    publishersPage.visit().login().search(searchTerm);

    cy.wait('@search');

    cy.percySnapshot('Search Page', {
      widths: [1280, 1440, 1680],
      percyCSS: '.plyr__video-wrapper { display: none!important; }',
    });
  });

  it('should apply filters', () => {
    cy.intercept({
      pathname: '/v1/videos',
      query: {
        query: 'Minute Physics',
        duration: 'PT0S-PT1M',
      },
    }).as('searchForTerms');

    publishersPage
      .visit()
      .login()
      .search(searchTerm)
      .applyFilters('Up to 1 min');

    cy.wait('@searchForTerms');

    cy.percySnapshot('Search with filters', {
      widths: [1280, 1440, 1680],
      percyCSS: '.plyr__video-wrapper { display: none!important; }',
    });
  });
});
