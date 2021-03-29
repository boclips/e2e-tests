export class VideoPage {
  public addToCart() {
    cy.findByText('Add to cart').click();
    cy.findByText('Remove').should('be.visible');
    return this;
  }
}
