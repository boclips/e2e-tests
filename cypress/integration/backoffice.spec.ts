import uuid = require('uuid');
import { BackofficePage } from '../page_objects/backoffice/BackofficePage';
import { generateToken } from '../../setup/generateToken';
import { getParametrisedVideoFixtures } from '../../setup/fixture/videos';
import { findOneVideoId } from '../../setup/api/videoApi';

context('Backoffice', () => {
  const backoffice = new BackofficePage();

  let token: string;

  it('should log in and view content partner page', () => {
    backoffice
      .visit()
      .logIn()
      .goToContentPartnerPage()
      .contentPartnerTableHasData();
  });

  it('should import a job CSV and make sure the video ingestor picks it up', () => {
    backoffice
      .visit()
      .logIn()
      .goToIngestsPage()
      .importJobCSV()
      .jobsTableHasData()
      .goToFirstJobDetails()
      .videosTableHasVideo();
  });

  it('should create a content partner', () => {
    const contentPartnerName = uuid.v4();
    backoffice
      .visit()
      .logIn()
      .goToContentPartnerPage()
      .createContentPartner()
      .setContentPartnerName(contentPartnerName)
      .setContentPartnerContract('Default Contract')
      .setContentPartnerDistributionMethods('STREAM')
      .setMarketingFiles()
      .submitContentPartner()
      .filterByContentPartner(contentPartnerName)
      .editFirstAndOnlyContentPartner();
  });

  it('should create a content partner contract', () => {
    const contractName = uuid.v4();
    backoffice
      .visit()
      .logIn()
      .goToContractPage()
      .createContract()
      .setContractName(contractName)
      .setContractDocument()
      .setContractRemittance('USD')
      .setContractDates()
      .setContractTerminationWarning('1')
      .setContractMaximumLicense('2')
      .setContractSellOffPeriod('3')
      .setContractRoyaltySplitDownload('4')
      .setContractRoyaltySplitStreaming('5')
      .submitContract()
      .editLatestContract()
      .checkContractRemittance()
      .checkContractDates();
  });

  it('should create a collection', () => {
    backoffice
      .visit()
      .logIn()
      .goToCollectionsPage()
      .openCollectionsModal()
      .fillCollectionDetails()
      .saveCollection()
      .findCreatedCollection();
  });

  it('should edit video', async () => {
    const videoId: string = await generateToken().then(
      async (freshToken: string) => {
        token = freshToken;
        const allInstructionalVideos = await getParametrisedVideoFixtures(
          freshToken,
        );
        return findOneVideoId(allInstructionalVideos[2].title, token);
      },
    );

    backoffice
      .visit()
      .logIn()
      .goToVideoPage()
      .findVideo(videoId)
      .goToEditPage()
      .editVideo()
      .validateVideoChange();
  });

  context('orders', () => {
    it('should import an order CSV and set its currency', () => {
      backoffice
        .visit()
        .logIn()
        .goToOrdersPage()
        .importOrderCSV()
        .loadOrderById('129')
        .updateOrderCurrency()
        .updateOrderItemDuration('17 Years')
        .updateOrderItemTerritory('World Wide');
    });

    it('should edit order', () => {
      backoffice
        .visit()
        .logIn()
        .gotToOrdersPage()
        .selectOrderFromOrdersTable()
        .editRowInOrdersTable()
        .editOrder()
        .validateOrder();
    });

    it('downloads order video assets', () => {
      backoffice
        .visit()
        .logIn()
        .gotToOrdersPage()
        .selectOrderFromOrdersTable()
        .hasDownloadableAssets();
    });

    it('should export a manifest', () => {
      backoffice.visit().logIn().goToOrdersPage().exportOrderCSV();
    });
  });
});
