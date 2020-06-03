import { By } from '../../support/By';
import Video from '../domain/Video';
import MarketingCollection from './domain/MarketingCollection';

function nodeToVideo(node: JQuery<HTMLElement>): Video {
  return {
    title: node.find(By.dataQa('video-title')).text(),
    description: node.find(By.dataQa('video-description')).text(),
  };
}

function mapToVideos(list: JQuery<HTMLElement>): Video[] {
  return list
    .toArray()
    .map((element: HTMLElement) => nodeToVideo(Cypress.$(element)));
}

export default class PublicMarketingCollectionPage {
  public withMarketingCollection(
    callback: (videos: MarketingCollection) => void,
  ) {
    cy.wait(1000)
      .get(By.dataQa('marketing-collection'))
      .then(collectionNode => {
        const collection = Cypress.$(collectionNode);
        const videos = mapToVideos(
          collection.find(By.dataQa('marketing-video')),
        );
        callback({
          title: collection.find(By.dataQa('title')).text(),
          description: collection.find(By.dataQa('description')).text(),
          videos,
        });
      });
    return this;
  }
}
