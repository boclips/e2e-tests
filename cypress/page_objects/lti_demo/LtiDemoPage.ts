export class LtiDemoPage {
  private readonly url: string;

  constructor() {
    this.url = Cypress.env('LTI_DEMO_BASE_URL');
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public logIn() {
    cy.get('#username').type(Cypress.env('BACKOFFICE_USERNAME'));
    cy.get('#password').type(Cypress.env('BACKOFFICE_PASSWORD'));
    cy.get('#kc-form-login').submit();
    return this;
  }

  public getResource() {
    cy.get('#select-resource-button').click();
    // TODO check that resource was returned (waiting on a bug with LTI fixtures)
  }
}
