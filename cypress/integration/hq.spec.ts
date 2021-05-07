import uuid = require('uuid');
import { HqPage } from '../page_objects/hq/HqPage';
import { generateTokenCypress } from '../../setup/generateToken';
import { getInstructionalVideos } from '../../setup/fixture/videos';
import { findVideosCypress } from '../../setup/api/videoApi';

context('HQ', () => {
  const hqPage = new HqPage();

  let videoId: string;

  it('should log in and view content partner page', () => {
    hqPage
      .visit()
      .logIn()
      .goToContentPartnerPage()
      .contentPartnerTableHasData();
  });

  it('should import a job CSV and make sure the video ingestor picks it up', () => {
    hqPage
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
    hqPage
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
    hqPage
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
    hqPage
      .visit()
      .logIn()
      .goToCollectionsPage()
      .openCollectionsModal()
      .fillCollectionDetails()
      .saveCollection()
      .findCreatedCollection();
  });

  xit('should edit video', () => {
    generateTokenCypress()
      .then(({ body }) => {
        const allInstructionalVideos = getInstructionalVideos();
        return findVideosCypress(
          `query=${allInstructionalVideos[2].title}`,
          body.access_token,
        ).then(({ body: { _embedded } }) => {
          videoId = _embedded.videos[0].id;
        });
      })
      .then(() => {
        hqPage
          .visit()
          .logIn()
          .goToVideoPage()
          .findVideo(videoId)
          .goToEditPage()
          .editVideo()
          .validateVideoChange();
      });
  });

  context('orders', () => {
    it('should import an order CSV and set its currency', () => {
      hqPage
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
      hqPage
        .visit()
        .logIn()
        .gotToOrdersPage()
        .selectOrderFromOrdersTable()
        .updateOrderOrganisation()
        .editRowInOrdersTable()
        .editOrder()
        .validateOrder();
    });

    it('downloads order video assets', () => {
      hqPage.visit().logIn().gotToOrdersPage().selectOrderFromOrdersTable();
    });

    it('should export a manifest', () => {
      hqPage.visit().logIn().goToOrdersPage().exportOrderCSV();
    });
  });
});
