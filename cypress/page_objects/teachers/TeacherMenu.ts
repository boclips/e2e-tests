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
    cy.get(By.dataQa('boclips-logo')).click();
    return new TeachersHomepage();
  }

  public goToCollections() {
    this.openAccountMenu();
    cy.get("[data-qa='user-videos']:visible").click();

    return new CollectionsPage();
  }

  public checkSavedCollectionInMyResources(title: string, isSaved: boolean) {
    this.openAccountMenu();

    cy.get("[data-qa='user-videos']:visible").click();
    if (isSaved) {
      cy.findByText(title);
    }

    return this;
  }

  private openAccountMenu() {
    cy.get('[data-qa="account-menu-open"]').first().click();

    return this;
  }
}
