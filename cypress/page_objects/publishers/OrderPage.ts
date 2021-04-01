import { By } from '../../support/By';

export class OrderPage {
  public assertStatus(status: string) {
    cy.get(By.dataQa('order-status-field')).should('contain', status);

    return this;
  }

  public assertOrderDate(date: string) {
    cy.get(By.dataQa('order-date-field')).should('contain', date);
    return this;
  }

  public assertDeliveryDate(date: string) {
    cy.get(By.dataQa('delivery-date-field')).should('contain', date);
    return this;
  }

  public assertTotalPrice(price: string) {
    cy.get(By.dataQa('total-price-field')).should('contain', price);

    return this;
  }

  public assertItemHasAdditionalServices(id: string, services: string[]) {
    const item = this.findOrderItemById(id);
    services.forEach((service: string) => {
      item.should('contain', service);
    });

    return this;
  }

  public findOrderItemById(id: string) {
    return cy
      .findByText(`ID: ${id}`)
      .parentsUntil('[data-qa="order-item-card"]')
      .parent('div');
  }
}
