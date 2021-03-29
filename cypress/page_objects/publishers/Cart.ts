import { By } from '../../support/By';

export class CartPage {
  public enableTranscriptRequestedForItem(videoId: string) {
    this.findItem(videoId)
      .findByText('Request transcripts')
      .click()
      .get('input[type=checkbox]')
      .should('be.checked');

    return this;
  }

  public enableCaptionsRequestedForItem(videoId: string) {
    this.findItem(videoId)
      .findByText('Request English captions')
      .click()
      .get('input[type=checkbox]')
      .should('be.checked');
    return this;
  }

  public addOtherTypeOfEditingForItem(videoId: string, request: string) {
    this.findItem(videoId)
      .findByText('Request other type of editing')
      .click()
      .get('input[type=checkbox]')
      .should('be.checked');

    cy.findByPlaceholderText('eg. Remove front and end credits')
      .type(request)
      .blur();
    return this;
  }

  public addTrim(videoId: string, trimFrom: string, trimTo: string) {
    this.findItem(videoId)
      .findByText('Trim video')
      .should('not.be.checked')
      .click()
      .get('input[type=checkbox]')
      .should('be.checked');

    cy.findByLabelText('From:').type(trimFrom);
    cy.findByLabelText('To:').type(trimTo);
    return this;
  }

  public assertTotalPrice(price: string) {
    cy.get(By.dataQa('total-price')).should('contain', price);

    return this;
  }

  public clickPlaceOrder() {
    cy.findByText('Place order').click();
    return this;
  }

  public clickConfirmOrder() {
    cy.findByText('Confirm order').click();
    return this;
  }

  public assertItemHasAdditionalServices(id: string, services: string[]) {
    const item = this.findSummaryItemById(id);
    services.forEach((service: string) => {
      item.should('contain', service);
    });

    return this;
  }

  public findSummaryItemById(id: string) {
    return cy
      .contains('[data-qa="order-summary-item-video-id"]', id)
      .parentsUntil('[data-qa="order-summary-item-wrapper"]')
      .parent('div');
  }

  public getOrderId() {
    return cy.get(By.dataQa('placed-order-id')).invoke('text');
  }

  private findItem(elementFromList: string) {
    return cy
      .findByText(`ID: ${elementFromList}`)
      .parentsUntil('[data-qa="cart-item-wrapper"]')
      .parent('div');
  }
}
