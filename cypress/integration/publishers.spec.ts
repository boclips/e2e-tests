import { PublishersPage } from '../page_objects/publishers/Publishers';

context('Publishers', () => {
  const publishersPage = new PublishersPage();

  const searchTerm: string = 'stabbed';

  it('search', () => {
    cy.intercept({
      pathname: '/v1/videos',
      query: {
        query: searchTerm,
      },
    }).as('search');

    publishersPage.visit().login().search(searchTerm);

    cy.wait('@search');

    cy.get('[data-qa="video-card-wrapper"]').should((videoCard) => {
      expect(videoCard.length).to.be.at.least(1);
    });

    cy.get('#hs-eu-confirmation-button').click();

    cy.percySnapshot('Search Page', {
      widths: [1280, 1440, 1680],
      percyCSS: '.plyr__video-wrapper { display: none!important; }',
    });
  });

  it('should apply filters', () => {
    cy.intercept({
      pathname: '/v1/videos',
      query: {
        query: searchTerm,
        duration: 'PT0S-PT1M',
      },
    }).as('searchForTerms');

    publishersPage
      .visit()
      .login()
      .search(searchTerm)
      .applyFilters('Up to 1 min');

    cy.wait('@searchForTerms');

    cy.get('[data-qa="video-card-wrapper"]').should((videoCard) => {
      expect(videoCard.length).to.be.at.least(1);
    });

    cy.get('#hs-eu-confirmation-button').click();

    cy.percySnapshot('Search with filters', {
      widths: [1280, 1440, 1680],
      percyCSS: '.plyr__video-wrapper { display: none!important; }',
    });
  });
});
