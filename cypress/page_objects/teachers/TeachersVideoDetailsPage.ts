import { By } from '../../support/By';
import { TeacherPage } from './index';

export class TeachersVideoDetailsPage extends TeacherPage {
  private readonly url: string;
  private readonly copyLink?: string;
  private readonly shareCode?: string;

  constructor(id: string, copyLink?: string, shareCode?: string) {
    super();
    this.url = Cypress.env('TEACHERS_BASE_URL') + '/videos/' + id;
    this.copyLink = copyLink;
    this.shareCode = shareCode;
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public visitCopyLinkUrl() {
    if (!this.copyLink) {
      throw Error('Copy link not known, cannot visit it, sorry.');
    }

    cy.visit(this.copyLink);
    return this;
  }

  public hasTitle() {
    cy.get(By.dataQa('video-title')).should('not.be.empty');
    return this;
  }

  public hasContentPartnerName() {
    cy.get(By.dataQa('video-created-by')).should('not.be.empty');
    return this;
  }

  public showsSharingModal() {
    cy.get('.share-code-dialog');
    return this;
  }

  public showsNoSharingModal() {
    cy.get('.share-code-dialog');
    return this;
  }

  public enterSharingCode() {
    if (!this.shareCode) {
      throw Error("Cannot enter sharing code, I don't have it, sorry.");
    }
    cy.get('.share-code-dialog')
      .get(By.dataQa('share-code-input'))
      .type(this.shareCode)
      .get(By.dataQa('share-code-submit'))
      .click();
    return this;
  }

  public assertRating(rating: number) {
    cy.get(By.dataQa('rating-score'))
      .invoke('attr', 'data-state')
      .should('contain', rating);
  }
}
