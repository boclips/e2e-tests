import { By } from '../../support/By';

export class BoclipsWebAppPage {
  private readonly url: string;

  constructor() {
    this.url = Cypress.env('BOCLIPS_WEB_APP_BASE_URL');
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public closeCookiesBanner() {
    cy.get('#hs-eu-confirmation-button').click();
    return this;
  }

  public search(searchTerm: string) {
    cy.findByRole('combobox').type(searchTerm);
    cy.findByText('Search').click();
    cy.get(By.dataQa('video-card'));
    return this;
  }

  public openYourOrdersPage() {
    cy.findByText('Account').click();
    cy.findByText('Your orders').click();

    return this;
  }

  public addToCartByTitle(title: string) {
    cy.contains(title)
      .parentsUntil('[data-qa="video-card-wrapper"]')
      .parent('div')
      .findByText('Add to cart')
      .click();
    return this;
  }

  public openVideoPageByTitle(title: string) {
    cy.contains('[data-qa="video-title"]', title).click();
    return this;
  }

  public goToCartPage() {
    cy.intercept({
      pathname: '/v1/cart',
    }).as('forCart');

    cy.findByText('Cart').click();

    cy.wait('@forCart');
    return this;
  }

  public login() {
    cy.get('#username').type(Cypress.env('HQ_USERNAME'));
    cy.get('#password').type(Cypress.env('HQ_PASSWORD'));
    cy.get('#kc-form-login').submit();
    return this;
  }

  public applyFiltersAndWaitForResponse(filterName: string, query: string) {
    cy.intercept({
      pathname: '/v1/videos',
      query: {
        query: query,
        duration: 'PT0S-PT1M',
      },
    }).as('searchForTerms');

    cy.get('label')
      .contains(filterName)
      .click({ force: true })
      .get('input[type=checkbox]')
      .should('be.checked')
      .wait('@searchForTerms');
    return this;
  }

  assertNumberOfItemsInCart(numberOfItems: number) {
    cy.get(By.dataQa('cart-counter')).should('contain', numberOfItems);
    return this;
  }
}
