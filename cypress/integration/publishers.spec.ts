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
    cy.get('.grid').should('be.visible');
    publishersPage.openAccountPanel();

    cy.percySnapshot('Account panel', {
      widths: [1280, 1440, 1680],
    });
  });

  it('search', () => {
    publishersPage.visit().login().search(searchTerm);

    cy.percySnapshot('Search Page', {
      widths: [1280, 1440, 1680],
      percyCSS: '.plyr__video-wrapper { display: none!important; }',
    });
  });

  it('should apply filters', () => {
    publishersPage
      .visit()
      .login()
      .search(searchTerm)
      .applyFilters('Educational')
      .applyFilters('Minute Physics')
      .applyFilters('Physics')
      .applyFilters('Up to 1 min');

    cy.get('.grid').should('be.visible');

    cy.percySnapshot('Search with filters', {
      widths: [1280, 1440, 1680],
      percyCSS: '.plyr__video-wrapper { display: none!important; }',
    });
  });
});
