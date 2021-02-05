import { By } from '../../support/By';

export class PublishersPage {
  private readonly url: string;

  constructor() {
    this.url = Cypress.env('PUBLISHERS_BASE_URL');
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public search(searchTerm: string) {
    cy.findByRole('combobox').type(searchTerm);
    cy.findByText('Search').click();
    cy.get(By.dataQa('video-card')).should('exist');
    return this;
  }

  public login() {
    cy.get('#username').type(Cypress.env('HQ_USERNAME'));
    cy.get('#password').type(Cypress.env('HQ_PASSWORD'));
    cy.get('#kc-form-login').submit();
    return this;
  }

  public applyFilters(filterName: string) {
    cy.get('label')
      .contains(filterName)
      .click({ force: true })
      .get('input[type=checkbox]')
      .should('be.checked');

    return this;
  }
}
