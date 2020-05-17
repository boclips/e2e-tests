import { By } from '../../support/By';
import VideoCollection from '../domain/VideoCollection';
import { CollectionPage, TeacherPage } from './index';

export class CollectionsPage extends TeacherPage {
  public reload() {
    cy.reload();
    return this;
  }

  public isEmpty() {
    cy.get(By.dataQa('collections-view-empty'));
    return this;
  }

  public goToCollectionDetails(collectionTitle: string) {
    return cy
      .get(
        `[data-state='${collectionTitle}'][data-qa='collection-card']:visible`,
      )
      .click()
      .then(() => {
        return new CollectionPage();
      });
  }

  public deleteCollection(collectionTitle: string) {
    cy.get(`[data-state='${collectionTitle}'][data-qa='collection-card']`)
      .find(By.dataQa('collection-edit-button'))
      .click();
    cy.get('[data-qa="delete-collection"]').click();

    cy.get('.ant-modal-confirm-btns .ant-btn-primary')
      .click()
      .log('Confirmed deletion of collection');
    cy.get('.ant-notification')
      .should('be.visible')
      .log('Notification informing user about collection deletion appeared');

    return this;
  }

  public inspectCollections(
    callback: (collections: VideoCollection[]) => void,
  ) {
    this.getCollectionCardsFromHtmlElements()
      .then(this.extractCollectionsFromHtmlElements)
      .then(callback);
    return this;
  }
}
