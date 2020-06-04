import { By } from '../../support/By';
import Video from '../domain/Video';

export class VideoManagementPage {
  private readonly url: string;

  constructor() {
    this.url = Cypress.env('BACKOFFICE_BASE_URL') + '/video-management';
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public logIn() {
    cy.get('#username').type(Cypress.env('BACKOFFICE_USERNAME'));
    cy.get('#password').type(Cypress.env('BACKOFFICE_PASSWORD'));
    cy.get('#kc-form-login').submit();
    return this;
  }

  public search(searchQuery: string) {
    cy.get(By.dataQa('search-input')).clear().type(searchQuery).type('{enter}');
    return this;
  }

  public showsVideo(callback: (videos: Video[]) => void) {
    const videos: Video[] = [];
    cy.get(By.dataQa('video'))
      .then((videoCards) =>
        videoCards.each((idx, el: HTMLElement) => {
          videos.push({
            id: el.querySelector(By.dataQa('video-id'))!.textContent!,
            title: el.querySelector(By.dataQa('video-title'))!.textContent!,
            contentPartner: el.querySelector(By.dataQa('video-channel'))!
              .textContent!,
          });
        }),
      )
      .then(() => callback(videos));
    return this;
  }
}
