import { By } from '../../support/By';
import VideoCollection from '../domain/VideoCollection';
import { MenuPage, TeachersVideoDetailsPage } from './index';

export class TeacherPage {
  public log(message: string) {
    cy.log(message);
    return this;
  }

  public menu() {
    return new MenuPage();
  }

  public inspectCollections(
    callback: (collections: VideoCollection[]) => void,
  ) {
    this.getCollectionCardsFromHtmlElements(
      cy.get(By.dataQa('collections-side-panel')),
    )
      .then(this.extractCollectionsFromHtmlElements)
      .then(callback);
    return this;
  }

  public goToFirstVideo() {
    cy.get(By.dataQa('video-card'))
      .first()
      .find(By.dataQa('video-title'))
      .click()
      .get(By.dataQa('video-details-page'))
      .should('exist');

    return cy
      .get(By.dataQa('share-button'))
      .click()
      .get(By.dataQa('copy-link'))
      .then(button => {
        return button.attr('data-link')!!.toString();
      })
      .then(copyLink => {
        return cy.location().then(location => {
          const pathname = location.pathname;
          const parts = pathname.split('/');
          const id = parts[parts.length - 1];
          return { id, copyLink };
        });
      })
      .then(pageProperties => {
        return cy.get('.share-code__code').then(shareCode => {
          return { ...pageProperties, shareCode: shareCode.text() };
        });
      })
      .then(pageProperties => {
        return new TeachersVideoDetailsPage(
          pageProperties.id,
          pageProperties.copyLink,
          pageProperties.shareCode,
        );
      });
  }

  protected getCollectionCardsFromHtmlElements(from = cy.get('body')) {
    return from.get(By.dataQa('collection-card'));
  }

  protected extractCollectionsFromHtmlElements(
    videoCards: JQuery<HTMLElement>,
  ): VideoCollection[] {
    const collections: VideoCollection[] = [];
    videoCards.each((idx, el: HTMLElement) => {
      collections.push({
        title: el.querySelector(By.dataQa('collection-title'))!.textContent!,
        bookmarked:
          el.querySelector(By.dataQa('unbookmark-collection')) !== null,
      });
    });
    return collections;
  }

  protected clickDropDownOption(dropdown: string, option: string) {
    cy.get(dropdown)
      .click()
      .should('be.visible');

    cy.contains(option)
      .scrollIntoView()
      .should('be.visible')
      .click();
  }

  protected clickSelectOption(select: string, optionDataState: string) {
    cy.get(By.dataQa(select))
      .click()
      .should('be.visible');

    cy.get(By.dataState(optionDataState))
      .scrollIntoView()
      .should('be.visible')
      .click();
  }
}
