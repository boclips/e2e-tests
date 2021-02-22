import { By } from '../../support/By';
import Video from '../domain/Video';
import { TeacherPage } from './index';

export class TeachersHomepage extends TeacherPage {
  private readonly url: string;

  constructor() {
    super();
    this.url = Cypress.env('TEACHERS_BASE_URL');
  }

  public configureHubspotCookie() {
    cy.setCookie('__hs_opt_out', 'yes');
    return this;
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public visitRegistrationPage() {
    cy.visit(this.url + '/create-account');
    return this;
  }

  public createAccount(username: string, password: string) {
    cy.findByLabelText('Work Email').type(username);
    cy.findByLabelText('Password').type(password);

    cy.server();
    cy.route('POST', '**/users').as('createUser');
    cy.route('GET', '**/admin').as('getAdminLinks');

    cy.findByRole('button', { name: /Create account/i }).click();

    cy.wait('@createUser');
    cy.wait('@getAdminLinks');
    cy.server({ enable: false });
    return this;
  }

  public activateAccount() {
    cy.findByLabelText('First name').type('Bob');
    cy.findByLabelText('Last name').type('Clip');
    cy.findByLabelText("I'm a").click();
    cy.findByText('Teacher').click();

    cy.findByText('Next').click();

    cy.get(By.dataQa('subjects')).should('be.visible').click();
    cy.get(By.dataState('Biology')).first().should('be.visible').click();

    cy.get('header').click();
    this.clickDropDownOption(By.dataQa('age-select'), '3-5');
    cy.get('header').click();

    cy.findByText('Next').click();

    this.selectFirstSelectOption('countries-filter-select', 'country-option');
    this.selectFirstSelectOption('states-filter-select', 'state-option');

    cy.get(By.dataQa('school-filter-select'))
      .should('be.visible')
      .click()
      .type('unlist')
      .type('{downarrow}{enter}');
    cy.get('header').click();

    cy.findByText('Next').click();

    cy.get(By.dataQa('privacy-policy')).click();

    cy.findByText('Finish').click();
    return this;
  }


  public accountActivated() {
    cy.get('.home-page').should('be.visible');
    return this;
  }

  public logIn(username: string, password: string) {
    cy.get(By.dataQa('email')).type(username);
    cy.get(By.dataQa('password')).type(password);
    cy.get(By.dataQa('login-button')).click();
    return this;
  }

  public applySubjectFilter(filterName: string) {
    cy.get('label')
      .contains(filterName)
      .click({ force: true })
      .get('input[type=checkbox]')
      .should('be.checked')
      .log(`Checked checkbox ${filterName}`)
      .get('body')
      .get(By.dataQa(`subject-filter-tag`))
      .contains(filterName)
      .get(By.dataQa('close-tag'))
      .should('be.visible')
      .log(`Filter tag ${filterName} was visible`);

    return this;
  }

  public applyDurationFilter(filterName: string) {
    cy.get('label')
      .contains(filterName)
      .click()
      .get('input[type=checkbox]')
      .should('be.checked')
      .log(`Checked checkbox ${filterName}`)
      .get('body')
      .get(By.dataQa(`duration-filter-tag`))
      .contains(filterName)
      .get(By.dataQa('close-tag'))
      .should('be.visible')
      .log(`Filter tag ${filterName} was visible`);

    return this;
  }

  public removeFilterTag(filterName: string) {
    cy.get(By.dataQa(`filter-tag`))
      .contains(filterName)
      .get(By.dataQa('close-tag'))
      .click()
      .log(`Removed filter tag ${filterName}`);

    return this;
  }

  public inspectResults(callback: (videos: Video[]) => void) {
    this.searchResultsHtmlElements()
      .then(this.extractVideosFromHtmlElements)
      .then(callback);
    return this;
  }

  public goToPage(pageNumber: number) {
    cy.get(
      `[data-qa='pagination'] .ant-pagination-item-${pageNumber} a`,
    ).click();
    return this;
  }

  private searchResultsHtmlElements() {
    return cy.get(By.dataQa('video-card'));
  }

  private extractVideosFromHtmlElements(
    videoCards: JQuery<HTMLElement>,
  ): Video[] {
    const videos: Video[] = [];
    videoCards.each((idx, el: HTMLElement) => {
      videos.push({
        title: el.querySelector(By.dataQa('video-title'))!.textContent!,
        description: el.querySelector(By.dataQa('video-description'))!
          .textContent!,
      });
    });
    return videos;
  }

  public saveCollection(title: string) {
    this.getFirstCollectionCardBy(title)
      .find(By.dataQa('open-button-menu'))
      .click();

    cy.get(By.dataQa('bookmark-collection')).should('be.visible').click();

    this.getFirstCollectionCardBy(title)
      .find(By.dataQa('open-button-menu'))
      .click();

    cy.get(By.dataQa('unbookmark-collection')).should('be.visible');

    cy.get('footer').click();

    return this;
  }

  public removeCollectionFromSaved(title: string) {
    this.getFirstCollectionCardBy(title)
      .find(By.dataQa('open-button-menu'))
      .click();

    cy.get(By.dataQa('unbookmark-collection')).click();

    // this.getFirstCollectionCardBy(title)
    //   .find(By.dataQa('open-button-menu'))
    //   .click();
    //
    // cy.get(By.dataQa('bookmark-collection'))
    //   .should('be.visible')
    //   .get(By.dataQa('unbookmark-collection'))
    //   .should('not.be.visible');
    //
    cy.get('footer').click();

    return this;
  }

  public createCollectionFromVideo(index: number, collectionTitle: string) {
    this.interactWithResult(index, () => {
      cy.get("[data-qa='video-collection-menu']:visible").click();
    })
      .get(By.dataQa('create-collection'))
      .click()
      .get(By.dataQa('new-collection-title'))
      .type(collectionTitle)
      .get(By.dataQa('create-collection-button'))
      .click()
      .wait(2000);

    return this;
  }

  public isVideoInCollection(
    index: number,
    collectionTitle: string,
    expectation: boolean = true,
  ) {
    this.searchResultsHtmlElements()
      .eq(index)
      .within(() => {
        cy.get(`[data-qa='video-collection-menu']:visible`).click();
      })
      .get(
        `[data-state="${collectionTitle}"][data-qa="remove-from-collection"]`,
      )
      .should(expectation ? 'be.visible' : 'not.exist');

    return this;
  }

  private interactWithResult(index: number, callback: () => void) {
    return this.searchResultsHtmlElements()
      .eq(index)
      .scrollIntoView()
      .within(callback);
  }

  private getFirstCollectionCardBy(title: string): Cypress.Chainable {
    return cy.get(By.dataState(title, 'collection-card')).first();
  }
}
