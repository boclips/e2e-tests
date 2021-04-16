import { By } from '../../support/By';
import { findOneValidVideoId } from '../../support/cypressBoclipsApiWrappers/findOneValidVideoId';

export class HqPage {
  private readonly url: string;

  constructor() {
    this.url = Cypress.env('HQ_BASE_URL');
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

  private static expandRow(index: number = 0) {
    cy.get(By.dataQa('orders-dropdown-icon-open'))
      .eq(index)
      .click({ force: true });
  }

  private static closeRow(index: number = 0) {
    cy.get(By.dataQa('orders-dropdown-icon-close'))
      .eq(index)
      .click({ force: true });
  }

  private static saveOrderRowEdit() {
    cy.get('body').first().click({ force: true });
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
    cy.get('#username').type(Cypress.env('HQ_USERNAME'));
    cy.get('#password').type(Cypress.env('HQ_PASSWORD'));
    cy.get('#kc-form-login').submit();
    return this;
  }

  public goToContentPartnerPage() {
    cy.get(By.dataQa('content-management'))
      .trigger('mouseover')
      .get(By.dataQa('channels-menu'))
      .click();

    return this;
  }

  public goToContractPage() {
    cy.get(By.dataQa('content-management'))
      .trigger('mouseover')
      .get(By.dataQa('contracts-menu'))
      .click();

    return this;
  }

  public goToCollectionsPage() {
    cy.get(By.dataQa('content-management'))
      .trigger('mouseover')
      .get(By.dataQa('collections-menu'))
      .click();

    return this;
  }

  public goToVideoPage() {
    cy.get(By.dataQa('content-management'))
      .trigger('mouseover')
      .get(By.dataQa('video-management-menu'))
      .click();

    return this;
  }

  public gotToOrdersPage() {
    cy.get(By.dataQa('orders-menu')).click();

    return this;
  }

  public selectOrderFromOrdersTable() {
    cy.get(By.dataQa('order')).first().click();

    return this;
  }

  public editRowInOrdersTable() {
    cy.get(By.dataQa('orders-dropdown-icon-open')).first().click();

    return this;
  }

  public editOrder() {
    cy.get(By.dataQa('editable-cell-edit-license-duration')).click();
    cy.get(By.dataQa('editable-cell-input-license-duration'))
      .clear()
      .type('3 Years');

    this.closeEditInput();

    cy.get(By.dataQa('editable-cell-edit-territory')).click();
    cy.get(By.dataQa('editable-cell-input-territory')).clear().type('Asia');

    this.closeEditInput();

    cy.get(By.dataQa('editable-cell-edit-price')).click();
    cy.get(By.dataQa('editable-cell-input-price')).clear().type('100');

    HqPage.closeRow();

    return this;
  }

  private closeEditInput() {
    cy.get('body').click();
  }

  public validateOrder() {
    HqPage.expandRow(0);

    cy.get(By.dataQa('editable-cell-value-price')).contains('USD 100');
    cy.get(By.dataQa('editable-cell-value-territory')).contains('Asia');
    cy.get(By.dataQa('editable-cell-value-license-duration')).contains(
      '3 Years',
    );

    return this;
  }

  public findVideo(videoId: string) {
    cy.get(By.dataQa('search-input')).type(videoId);
    cy.get(By.dataQa('search-video-button')).click();
    return this;
  }

  public goToEditPage() {
    cy.get(By.dataQa('edit-video-button')).click();
    return this;
  }

  public editVideo() {
    cy.get(By.dataQa('edit-video-form-title')).type(' edited');

    cy.get(By.dataQa('open-captions-modal')).first().click();

    cy.get(By.dataQa('edit-caption-text'))
      .wait(2000)
      .clear()
      .type('WEBVTT\n\n00:00:00.000 --> 00:00:25.460\ncaption 1 value');

    cy.get(By.dataQa('submit-captions')).first().click();

    cy.get(By.dataQa('edit-video-form-description'))
      .clear()
      .type('edit video test');

    cy.get(By.dataQa('subjects-select')).click();

    cy.get(By.dataState('subject-item')).first().click();

    cy.get(By.dataQa('edit-video-form-title')).click();
    // cy.get(By.dataQa('oneToThree')).click();
    // cy.get(By.dataQa('threeToFive')).click();
    cy.get(By.dataQa('save-video-button')).click();

    return this;
  }

  public validateVideoChange() {
    cy.get(By.dataQa('video-title')).should((title) => {
      expect(title.text()).contains('edited');
    });

    return this;
  }

  public fillCollectionDetails() {
    cy.get(By.dataQa('collection-title-input')).type('collection test title');
    cy.get(By.dataQa('collection-description-input')).type(
      'collection test description',
    );
    cy.get(By.dataQa('upload-dropzone')).then((dropzone) => {
      const content = '123,456,789';
      HqPage.uploadCSV(content, dropzone);
    });

    //This functionality is broken whilst we work on content package management,
    // dropdown soon to be redundant

    // cy.get(By.dataQa('access-rules-select')).click();
    // cy.get(By.dataState('access-rules-option')).first().click();
    cy.get(By.dataQa('collection-title-input')).click();

    return this;
  }

  public findCreatedCollection() {
    cy.get(By.dataQa('collections-filter-input')).type('collection test title');
    cy.get(By.dataQa('filter-collection-button')).click();
    return this;
  }

  public saveCollection() {
    cy.get(By.dataQa('save-button')).click();

    return this;
  }

  public openCollectionsModal() {
    cy.get(By.dataQa('create-new-collection-button')).click();

    return this;
  }

  public contentPartnerTableHasData() {
    cy.get(By.dataQa('channel')).its('length').should('be.gte', 1);

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
    cy.wait(2000).reload().get(By.dataQa('job')).should('be.visible');

    return this;
  }

  public goToFirstJobDetails() {
    cy.get(By.dataQa('job')).first().click();
    return this;
  }

  public videosTableHasVideo() {
    cy.get(By.dataQa('video-id')).should('contain', 'CCAI_01_CLEAN_What-Is-AI');
    return this;
  }

  public importOrderCSV() {
    findOneValidVideoId().then((videoId) => {
      cy.get(By.dataQa('upload-dropzone')).then((dropzone) => {
        const content = `Order No,Order Through Platform,Month Date ,Order request Date,Order Fulfillment Date,Quarter,Member (request),Member (authorise) ID,Clip ID,Title,Source,Source Code,License Duration,Territory,Type,Price,Publisher,ISBN / PRODUCT DESCRIP,Language,Captioning,Trim,Notes,Remittance Notes,
129,yes,Nov-15,05/11/15,,2015 Q4,Susan Andrews,871,${videoId},Learning from proximity to power,XKA Digital,123,5,Europe,Instructional Clips,£200 ,ICS,,,,,Complete,`;
        HqPage.uploadCSV(content, dropzone);
      });
    });

    return this;
  }

  public importJobCSV() {
    findOneValidVideoId().then(() => {
      cy.get(By.dataQa('upload-dropzone')).then((dropzone) => {
        const content = `Provider,Unique ID,Title,Description,Creation Date,Keywords,Subject,Type ID,Legal Restrictions,URL
Crash Course Artificial Intelligence,CCAI_01_CLEAN_What-Is-AI,What Is Artificial Intelligence? #1,"Artificial intelligence is everywhere",09/08/2019,"Crash course|Artificial intelligence",Computer Science,3,,https://kmvideowatchfolder.s3-eu-west-1.amazonaws.com/Crash_Course/CCAI_01_CLEAN_What-Is-AI.mp4`;
        HqPage.uploadCSV(content, dropzone);
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
    cy.get(`.ant-select-item-option-content`)
      .contains('USD')
      .scrollIntoView()
      .click();
    cy.get(By.dataQa('edit-form-save')).click();

    return this;
  }

  public updateOrderOrganisation() {
    cy.get(By.dataQa('organisation-edit'))
      .get(By.dataQa('editable-cell-dropdown-icon'))
      .click();

    cy.get(By.dataQa('organisation-edit')).get(By.dataQa('dropdown')).click();

    cy.get(By.dataQa('dropdown-option')).first().click();

    cy.contains('Organisation information changed!').should('be.visible');

    return this;
  }

  public updateOrderItemDuration(duration: string, index: number = 0) {
    HqPage.expandRow(index);

    cy.get(By.dataQa('editable-cell-edit-license-duration')).click();
    cy.get(By.dataQa('editable-cell-input-license-duration'))
      .clear()
      .type(duration);

    HqPage.saveOrderRowEdit();

    cy.get(By.dataQa('editable-cell-value-license-duration')).contains(
      duration,
    );

    HqPage.closeRow(index);

    return this;
  }

  public updateOrderItemTerritory(territory: string, index: number = 0) {
    HqPage.expandRow(index);

    cy.get(By.dataQa('editable-cell-edit-territory')).click();
    cy.get(By.dataQa('editable-cell-input-territory')).clear().type(territory);

    HqPage.saveOrderRowEdit();

    cy.get(By.dataQa('editable-cell-value-territory')).contains(territory);

    HqPage.closeRow(index);

    return this;
  }

  public loadOrderById(orderId: string) {
    cy.get(By.dataState(orderId)).click();

    return this;
  }

  public createContentPartner() {
    cy.get(By.dataQa('new-channel-button')).click();

    return this;
  }

  public createContract() {
    cy.get(By.dataQa('new-contract-button')).click();

    return this;
  }

  public setContractName(name: string) {
    cy.get(By.dataQa('details-tab-content-partner-name')).type(name);

    return this;
  }

  public setContractTerminationWarning(amount: string) {
    cy.get(By.dataQa('details-tab-termination-warning')).type(amount);

    return this;
  }

  public setContractMaximumLicense(amount: string) {
    cy.get(By.dataQa('details-tab-maximum-license')).type(amount);

    return this;
  }

  public setContractSellOffPeriod(amount: string) {
    cy.get(By.dataQa('details-tab-sell-off-period')).type(amount);

    return this;
  }

  public setContractRoyaltySplitDownload(amount: string) {
    cy.get(By.dataQa('details-tab-download-royalty-split')).type(amount);

    return this;
  }

  public setContractRoyaltySplitStreaming(amount: string) {
    cy.get(By.dataQa('details-tab-streaming-royalty-split')).type(amount);

    return this;
  }

  public setContentPartnerName(name: string) {
    this.switchTabs('Details');

    cy.get(By.dataQa('name-input')).type(name);

    return this;
  }

  public setContentPartnerContract(name: string) {
    this.switchTabs('Details');

    cy.get(By.dataQa('contract-select')).click();
    cy.get(`.ant-select-item-option-content`)
      .contains(name)
      .scrollIntoView()
      .click();

    return this;
  }

  public setContentPartnerDistributionMethods(...names: DistributionMethod[]) {
    this.switchTabs('Ingest');

    if (names.find((it) => it === 'DOWNLOAD')) {
      cy.findByText('Download (B2B)').click();
    }

    if (names.find((it) => it === 'STREAM')) {
      cy.findByText('Stream (B2T, API, LTI)').click();
    }

    cy.get('input[type="checkbox"]:checked').should(
      'have.length',
      names.length,
    );

    return this;
  }

  public setMarketingFiles() {
    this.switchTabs('Marketing');

    cy.get('.ant-upload-drag-container:visible').then((it) => {
      expect(it).to.have.length(3);

      const [logoUpload, showreelUpload, sampleVideosUpload] = it;

      HqPage.uploadToDropzone(logoUpload, 'logo.png', 'image/png');
      HqPage.uploadToDropzone(showreelUpload, 'showreel.avi', 'video/avi');
      HqPage.uploadToDropzone(sampleVideosUpload, 'sample1.mp4', 'video/mp4');
      HqPage.uploadToDropzone(sampleVideosUpload, 'sample2.mp4', 'video/mp4');
    });

    cy.wait(2000);

    cy.get('.ant-upload-drag-container:visible').should('have.length', 2); // showreel shouldn't display once uploaded to

    cy.get('.ant-upload-list-item').should('have.length', 4);

    return this;
  }

  public setContractRemittance(currency: string) {
    cy.get(
      'input#contentPartnerContractForm_details_remittanceCurrency',
    ).click();

    cy.get('.ant-select-item-option-content').contains(currency).click();

    return this;
  }

  public checkContractRemittance() {
    cy.get('.ant-select-selection-item')
      .contains('USD')
      .should('have.length', 1);

    return this;
  }

  public setContractDates() {
    cy.get('.ant-picker-input').first().click();

    cy.get('.ant-picker-cell-inner').contains('12').first().click();
    cy.get('.ant-picker-cell-inner').contains('16').last().click();

    return this;
  }

  public checkContractDates() {
    cy.get('.ant-picker-input')
      .find('input')
      .should((inputs) => {
        console.log(inputs);
        expect(inputs[0].value).to.contain('-12');
        expect(inputs[1].value).to.contain('-16');
      });

    return this;
  }

  public setContractDocument() {
    cy.get('.ant-upload-drag-container:visible').then((it) => {
      expect(it).to.have.length(1);

      const [contractUpload] = it;

      HqPage.uploadToDropzone(
        contractUpload,
        'contract.pdf',
        'application/pdf',
      );
    });

    cy.wait(2000);

    cy.get('.ant-upload-drag-container:visible').should('have.length', 0); // dropzone shouldn't display once uploaded to

    cy.get('.ant-upload-list-item').should('have.length', 1); // there is a file item in the file list

    cy.get('.ant-upload-list-item-uploading').should('have.length', 0); // the file isn't still loading

    cy.get('.ant-upload-list-item-error').should('have.length', 0); // the file upload did not fail

    return this;
  }

  public submitContentPartner() {
    cy.findAllByTestId('save-channel-button').last().click();

    return this;
  }

  public submitContract() {
    cy.get(By.dataQa('save-contract-button')).click();

    return this;
  }

  public filterByContentPartner(name: string) {
    cy.wait(1000);

    cy.get(By.dataQa('channel-filter-input'))
      .get('.ant-select-selector')
      .then((it) => {
        it.trigger('mousedown');
      })
      .type(name);

    cy.get('.ant-select-item-option-content').click();

    return this;
  }

  public editFirstAndOnlyContentPartner() {
    cy.get(By.dataQa('edit-channel'))
      .should((it) => expect(it).to.have.length(1))
      .click();

    return this;
  }

  public editLatestContract() {
    cy.wait(500);

    cy.get(By.dataQa('edit-contract')).last().click();

    cy.scrollTo('top'); // for visibility

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
