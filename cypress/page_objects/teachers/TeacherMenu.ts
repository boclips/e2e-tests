import { By } from '../../support/By';
import { CollectionsPage, TeachersHomepage } from './index';

export class MenuPage {
  public search(searchQuery: string) {
    cy.findByPlaceholderText('Enter your search term')
      .clear()
      .type(searchQuery)
      .type('{enter}');
    return new TeachersHomepage();
  }

  public goToHomepage() {
    cy.get(By.dataQa('boclips-logo')).scrollIntoView().click();
    return new TeachersHomepage();
  }

  public goToCollections() {
    this.openAccountMenu();
    cy.get("[data-qa='user-videos']:visible").scrollIntoView().click();

    return new CollectionsPage();
  }

  public checkSavedCollectionInMyResources(title: string, isSaved: boolean) {
    this.openAccountMenu();

    cy.get("[data-qa='user-videos']:visible").scrollIntoView().click();
    if (isSaved) {
      cy.findByText(title);
    }

    return this;
  }

  private openAccountMenu() {
    cy.get(By.dataQa('account-menu-open') + `:visible`)
      .first()
      .should('be.visible')
      .scrollIntoView().click();

    return this;
  }
}
