import VideoCollection from '../domain/VideoCollection';
import { CollectionPage, TeacherPage } from './index';

export class CollectionsPage extends TeacherPage {

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

  public inspectCollections(
    callback: (collections: VideoCollection[]) => void,
  ) {
    this.getCollectionCardsFromHtmlElements()
      .then(this.extractCollectionsFromHtmlElements)
      .then(callback);
    return this;
  }
}
