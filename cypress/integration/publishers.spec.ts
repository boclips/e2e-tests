import { PublishersPage } from '../page_objects/publishers/Publishers';

context('Publishers', () => {
  const publishersPage = new PublishersPage();

  const searchTerm: string = 'Minute Physics';

  it('lands on a homepage', () => {
    publishersPage.visit().login();

    cy.get('.grid').should('be.visible');

    cy.percySnapshot('Home page');
  });

  it('opens account panel', () => {
    publishersPage.visit().login();
    cy.get('.grid').should('be.visible');
    publishersPage.openAccountPanel();

    cy.percySnapshot('Account panel');
  });

  it('search', () => {
    publishersPage.visit().login().search(searchTerm);

    cy.get('.grid').should('be.visible');

    cy.percySnapshot('search page');
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

    cy.percySnapshot('Search with filters');
  });
});
