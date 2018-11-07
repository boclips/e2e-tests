import { By } from "../support/By";
import MarketingCollectionSummary from "./domain/MarketingCollectionSummary";
import MarketingCollectionVideo from "./domain/MarketingCollectionVideo";
import PublicMarketingCollectionPage from "./PublicMarketingCollectionPage";

function updateInlineEdit(dataQa: string, text: string) {
  cy.get(By.dataQa(dataQa))
    .click()
    .get(By.dataState("edit"))
    .focus()
    .clear()
    .type(text)
    .blur();
}

function updateVideoInlineEdit(
  dataState: string,
  dataQa: string,
  text: string
) {
  cy.get(By.dataState(dataState))
    .find(By.dataQa(dataQa, ""))
    .click()
    .get(By.dataState("edit"))
    .focus()
    .clear()
    .type(text)
    .blur();
}

class MarketingCollectionPage {
  public setTitle(title: string) {
    updateInlineEdit("title", title);
    return this;
  }

  public setDescription(description: string) {
    updateInlineEdit("description", description);
    return this;
  }

  public addVideo(video: MarketingCollectionVideo) {
    cy.get(By.dataQa("add-video")).click();

    cy.get(By.dataQa("video-form-id")).clear();
    cy.get(By.dataQa("video-form-id")).type(video.id!);
    cy.get(By.dataQa("video-form-title")).clear();
    cy.get(By.dataQa("video-form-title")).type(video.title);
    cy.get(By.dataQa("video-form-description")).clear();
    cy.get(By.dataQa("video-form-description")).type(video.description);

    cy.get(By.dataQa("video-form-submit")).click();
    return this;
  }

  public deleteVideo(videoId: string) {
    cy.get(By.dataState(videoId))
      .find(By.dataQa("delete-video", "i"))
      .click();
    cy.get(".ant-popover-buttons .ant-btn-primary").click();
    return this;
  }

  public withVideos(callback: (videos: MarketingCollectionVideo[]) => void) {
    const videos: MarketingCollectionVideo[] = [];
    cy.get(By.dataQa("marketing-video"))
      .then(videoCards =>
        videoCards.each((idx, el: HTMLElement) => {
          videos.push({
            title: el.querySelector(By.dataQa("video-title"))!.textContent!,
            description: el.querySelector(By.dataQa("video-description"))!
              .textContent!
          });
        })
      )
      .then(() => callback(videos));
    return this;
  }

  public setVideoTitle(videoId: string, videoTitle: string) {
    updateVideoInlineEdit(videoId, "video-title-edit", videoTitle);
    return this;
  }

  public setVideoDescription(videoId: string, videoDescription: string) {
    updateVideoInlineEdit(videoId, "video-description-edit", videoDescription);
    return this;
  }

  public goToPublicCollection() {
    cy.wait(1000)
      .get(By.dataQa("copy-link-button"))
      .click();
    return new PublicMarketingCollectionPage();
  }
}

export class MarketingCollectionListPage {
  private readonly url: string;

  constructor() {
    this.url = "/marketing-collections";
  }

  public goToCreateCollection() {
    cy.get(By.dataQa("create-collection-button")).click();
    return new MarketingCollectionPage();
  }

  public visit() {
    cy.visit(this.url);
    return this;
  }

  public logIn() {
    cy.get("#username").type(Cypress.env("USERNAME"));
    cy.get("#password").type(Cypress.env("PASSWORD"));
    cy.get("#kc-form-login").submit();
    return this;
  }

  public withMarketingCollections(
    callback: (collections: MarketingCollectionSummary[]) => void
  ) {
    cy.get(By.dataQa("marketing-collection-summary")).then(
      marketingCollections => {
        const allMarketingCollections: any = marketingCollections
          .toArray()
          .map((el: any) => {
            return {
              title: el.querySelector(By.dataQa("title"))!.textContent!,
              description: el.querySelector(By.dataQa("description"))!
                .textContent!,
              numberOfVideos: Number(
                el.querySelector(By.dataQa("number-of-videos"))!.textContent!
              )
            };
          });
        let i = 0;
        while (i >= 10) {
          try {
            callback(allMarketingCollections);
            cy.wait(200);
          } catch (e) {
            i++;
          }
        }
      }
    );
    return this;
  }

  public deleteCollectionWithTitle(title: string) {
    cy.get(By.dataState(title)).within(() => {
      cy.get(By.dataQa("delete-button")).click();
    });
    cy.get(".ant-popover-buttons .ant-btn-primary").click();
    return this;
  }
}
