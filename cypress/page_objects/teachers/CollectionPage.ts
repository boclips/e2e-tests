import { By } from '../../support/By';
import Video from '../domain/Video';
import { TeacherPage } from './index';

export class CollectionPage extends TeacherPage {
  public reload() {
    cy.reload();
    return this;
  }

  public setName(name: string): CollectionPage {
    cy.get(By.dataQa('collection-edit-button')).click();
    cy.get(By.dataQa('title-edit'))
      .clear()
      .type(name);
    cy.contains('Save').click();
    return this;
  }

  public setSubject(subject: string): CollectionPage {
    cy.get(By.dataQa('collection-edit-button')).click();

    cy.get('[data-qa="subjects"]').click();

    cy.get(`.ant-select-dropdown-menu-item`).should('be.visible');

    cy.get(`.ant-select-dropdown-menu-item`)
      .contains(subject)
      .scrollIntoView()
      .click();

    cy.get('.ant-modal-title').click();
    cy.contains('Save').click();
    cy.get('.ant-modal-title').should('not.be.visible');

    cy.get(By.dataQa('subject-tag'))
      .get(By.dataQa('filter-tag'))
      .should('contain', subject);
    return this;
  }

  public itHasName(name: string): CollectionPage {
    cy.get(By.dataQa('collection-title')).should('contain', name);
    return this;
  }

  public checkA11yOnCollectionPage(threshold: number) {
    cy.get(By.dataQa('collection-title'));
    cy.checkA11y(threshold);
    return this;
  }

  private itemsHtmlElements() {
    return cy.get(By.dataQa('video-card'));
  }

  private extractVideosFromHtmlElements(
    videoCards: JQuery<HTMLElement>,
  ): Video[] {
    const videos: Video[] = [];
    videoCards.each((idx, el: HTMLElement) => {
      videos.push({
        title: el.querySelector(By.dataQa('video-title'))!.textContent!,
        description: el.querySelector(By.dataQa('video-description'))!
          .textContent!,
      });
    });
    return videos;
  }

  public isEmpty() {
    cy.get(By.dataQa('collection-empty-title'));
    return this;
  }

  public inspectItems(callback: (videos: Video[]) => void) {
    this.itemsHtmlElements()
      .then(this.extractVideosFromHtmlElements)
      .then(callback);
    return this;
  }

  public removeVideo(index: number) {
    return this.interactWithItem(index, () =>
      cy
        .get('[data-qa="remove-from-collection"]:visible')
        .should('be.visible')
        .click(),
    );
  }

  private interactWithItem(index: number, callback: () => void) {
    this.itemsHtmlElements()
      .eq(index)
      .scrollIntoView()
      .within(callback);
    return this;
  }
}
