import { By } from '../../support/By';
import { findOneValidVideoId } from '../../support/cypressBoclipsApiWrappers/findOneValidVideoId';

export class BackofficePage {
  private readonly url: string;

  constructor() {
    this.url = Cypress.env('BACKOFFICE_BASE_URL');
  }

  private static uploadCSV(content: string, dropzone: JQuery) {
    const blob = new Blob([content]);
    const orderFile = new File([blob], 'orders.csv', {
      type: 'text/csv',
    });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(orderFile);

    cy.wrap(dropzone, { log: false }).trigger('drop', {
      force: true,
      dataTransfer,
    });
  }

  private static startOrderRowEdit(index: number = 0) {
    cy.get(By.dataQa('edit-row-button'))
      .eq(index)
      .click({ force: true });
  }

  private static saveOrderRowEdit() {
    cy.get(By.dataQa('inline-save'))
      .first()
      .click({ force: true });
  }

  private static uploadToDropzone(
    element: HTMLElement,
    filename: string,
    filetype: string,
  ) {
    const blob = new Blob(['content']);
    const logo = new File([blob], filename, {
      type: filetype,
    });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(logo);

    cy.wrap(element).trigger('drop', {
      force: true,
      dataTransfer,
    });
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

  public goToContentPartnerPage() {
    cy.get(By.dataQa('content-management'))
      .trigger('mouseover')
      .get(By.dataQa('content-partners-menu'))
      .click();

    return this;
  }

  public contentPartnerTableHasData() {
    cy.get(By.dataQa('content-partner'))
      .its('length')
      .should('be.gte', 1);

    return this;
  }

  public goToOrdersPage() {
    cy.get(By.dataQa('orders-menu')).click();

    return this;
  }

  public goToIngestsPage() {
    cy.get(By.dataQa('ingest-sub-menu'))
      .trigger('mouseover')
      .get(By.dataQa('video-ingests-menu'))
      .click();

    return this;
  }

  public jobsTableHasData() {
    cy.wait(2000)
      .reload()
      .get(By.dataQa('job'))
      .its('length')
      .should('be.gte', 1);

    return this;
  }

  public goToFirstJobDetails() {
    cy.get(By.dataQa('job'))
      .first()
      .click();
    return this;
  }

  public videosTableHasVideo() {
    cy.get(By.dataQa('video-id'))
      .its('text')
      .should('be', 'CCAI_01_CLEAN_What-Is-AI');
    return this;
  }

  public importOrderCSV() {
    findOneValidVideoId().then(videoId => {
      cy.get(By.dataQa('upload-dropzone')).then(dropzone => {
        const content = `Order No,Order Through Platform,Month Date ,Order request Date,Order Fulfillment Date,Quarter,Member (request),Member (authorise) ID,Clip ID,Title,Source,Source Code,License Duration,Territory,Type,Price,Publisher,ISBN / PRODUCT DESCRIP,Language,Captioning,Trim,Notes,Remittance Notes,
129,yes,Nov-15,05/11/15,,2015 Q4,Susan Andrews,871,${videoId},Learning from proximity to power,XKA Digital,123,5,Europe,Instructional Clips,£200 ,ICS,,,,,Complete,`;
        BackofficePage.uploadCSV(content, dropzone);
      });
    });

    return this;
  }

  public importJobCSV() {
    findOneValidVideoId().then(() => {
      cy.get(By.dataQa('upload-dropzone')).then(dropzone => {
        const content = `Provider,Unique ID,Title,Description,Creation Date,Keywords,Subject,Type ID,Legal Restrictions,URL
Crash Course Artificial Intelligence,CCAI_01_CLEAN_What-Is-AI,What Is Artificial Intelligence? #1,"Artificial intelligence is everywhere",09/08/2019,"Crash course|Artificial intelligence",Computer Science,3,,https://kmvideowatchfolder.s3-eu-west-1.amazonaws.com/Crash_Course/CCAI_01_CLEAN_What-Is-AI.mp4`;
        BackofficePage.uploadCSV(content, dropzone);
      });
    });

    return this;
  }

  public exportOrderCSV() {
    cy.get(By.dataQa('export-orders-csv')).click();
    cy.get(By.dataQa('usd-fx-rate-input')).type('1.5');
    cy.get(By.dataQa('eur-fx-rate-input')).type('2.5');
    cy.get(By.dataQa('sgd-fx-rate-input')).type('3.5');
    cy.get(By.dataQa('aud-fx-rate-input')).type('4.5');
    cy.get(By.dataQa('cad-fx-rate-input')).type('1.11');

    /*
     * Electron doesn't play nicely with downloaded files in ci. It prompts the user with a selector that needs native events to interact with
     * https://github.com/cypress-io/cypress/issues/433
     */
    // cy.get(By.dataQa('submit-fx-rates')).click();

    return this;
  }

  public updateOrderCurrency() {
    cy.get(By.dataQa('edit-currency')).click();
    cy.get(By.dataQa('currency-select')).click();
    cy.get(`.ant-select-dropdown-menu-item`)
      .contains('USD')
      .scrollIntoView()
      .click();
    cy.get(By.dataQa('inline-save')).click();

    return this;
  }

  public updateOrderItemDuration(duration: string, index: number = 0) {
    BackofficePage.startOrderRowEdit(index);

    cy.get(By.dataQa('duration-edit'))
      .find('input')
      .clear()
      .type(duration);

    BackofficePage.saveOrderRowEdit();

    cy.get(By.dataQa('license-duration')).contains(duration);

    return this;
  }

  public updateOrderItemTerritory(territory: string, index: number = 0) {
    BackofficePage.startOrderRowEdit(index);

    cy.get(By.dataQa('territory-edit'))
      .find('input')
      .clear()
      .type(territory);

    BackofficePage.saveOrderRowEdit();

    cy.get(By.dataQa('license-territory')).contains(territory);

    return this;
  }

  public loadOrderById(orderId: string) {
    cy.get(By.dataState(orderId)).click();

    return this;
  }

  public createContentPartner() {
    cy.get(By.dataQa('new-content-partner-button')).click();

    return this;
  }

  public setContentPartnerName(name: string) {
    this.switchTabs('DETAILS');

    cy.get(By.dataQa('name-input')).type(name);

    return this;
  }

  public setContentPartnerDistributionMethods(...names: DistributionMethod[]) {
    this.switchTabs('INGEST');

    cy.get('input[type="checkbox"]').then(checkboxes => {
      if (names.find(it => it === 'STREAM')) {
        checkboxes[0].click();
      }
      if (names.find(it => it === 'DOWNLOAD')) {
        checkboxes[1].click();
      }
    });

    cy.get('input[type="checkbox"]:checked').should(
      'have.length',
      names.length,
    );

    return this;
  }

  public setMarketingFiles() {
    this.switchTabs('MARKETING');

    cy.wait(1000);
    cy.get('.ant-upload-drag-container:visible').then(it => {
      expect(it).to.have.length(3);

      const [logoUpload, showreelUpload, sampleVideosUpload] = it;

      BackofficePage.uploadToDropzone(logoUpload, 'logo.png', 'image/png');
      BackofficePage.uploadToDropzone(
        showreelUpload,
        'showreel.avi',
        'video/avi',
      );
      BackofficePage.uploadToDropzone(
        sampleVideosUpload,
        'sample1.mp4',
        'video/mp4',
      );
      BackofficePage.uploadToDropzone(
        sampleVideosUpload,
        'sample2.mp4',
        'video/mp4',
      );
    });

    cy.wait(2000);

    cy.get('.ant-upload-drag-container:visible').should('have.length', 2); // showreel shouldn't display once uploaded to

    cy.get('.ant-upload-list-item').should('have.length', 4);

    return this;
  }

  public checkMarketingFiles() {
    this.switchTabs('MARKETING');

    cy.wait(1000);
    cy.get('.ant-upload-drag-container:visible').should('have.length', 2); // showreel shouldn't display once uploaded to

    cy.get('.ant-upload-list-item').should('have.length', 4);

    return this;
  }

  public submitContentPartner() {
    cy.get(By.dataQa('save-content-partner-button')).click();

    return this;
  }

  public filterByContentPartner(name: string) {
    cy.wait(1000);

    cy.get('.content-partner-filter input')
      .then(it => {
        it.trigger('click');
      })
      .type(name);

    cy.get('.ant-select-dropdown-menu-item').click();

    return this;
  }

  public editFirstAndOnlyContentPartner() {
    cy.get(By.dataQa('edit-content-partner'))
      .should(it => expect(it).to.have.length(1))
      .click();

    return this;
  }

  private switchTabs(label: string) {
    cy.get('.ant-tabs-tab')
      .filter((_, it) => {
        return it.innerText === label;
      })
      .first()
      .click();

    return this;
  }
}

type DistributionMethod = 'STREAM' | 'DOWNLOAD';
