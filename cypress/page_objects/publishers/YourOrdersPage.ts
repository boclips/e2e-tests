import { By } from '../../support/By';

export class YourOrdersPage {
  public assertOrderHasStatus(id: string, status: string) {
    cy.findByText(id)
      .parentsUntil('.ant-list-items')
      .find(By.dataQa('order-status-field'))
      .should('contain', status);

    return this;
  }

  public openOrderPage(id: string) {
    cy.findByText(id).click();
  }
}
