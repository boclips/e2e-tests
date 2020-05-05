import uuid = require('uuid');
import { BackofficePage } from '../page_objects/backoffice/BackofficePage';
import { generateToken } from '../../setup/generateToken';
import { getParametrisedVideoFixtures } from '../../setup/fixture/videos';
import { findOneVideoId } from '../../setup/api/videoApi';

context('Backoffice', () => {
  const backoffice = new BackofficePage();

  let token: string;
  let videoId: string;

  it('should log in and view content partner page', () => {
    backoffice
      .visit()
      .logIn()
      .goToContentPartnerPage()
      .contentPartnerTableHasData();
  });

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

  it('should export a manifest', () => {
    backoffice
      .visit()
      .logIn()
      .goToOrdersPage()
      .exportOrderCSV();
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
      .goToContentPartnerContractPage()
      .createContentPartnerContract()
      .setContentPartnerContractName(contractName)
      .setContractDocument()
      .setContractRemittance('USD')
      .setContractDates()
      .setContentPartnerContractTerminationWarning('1')
      .setContentPartnerContractMaximumLicense('2')
      .setContentPartnerContractSellOffPeriod('3')
      .setContentPartnerContractRoyaltySplitDownload('4')
      .setContentPartnerContractRoyaltySplitStreaming('5')
      .submitContentPartnerContract()
      .editLatestContentPartnerContract(contractName)
      .checkContractRemittance('USD')
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

  it('should edit video', () => {
    generateToken()
      .then(async (freshToken: string) => {
        token = freshToken;
        const allInstructionalVideos = await getParametrisedVideoFixtures(
          freshToken,
        );
        return findOneVideoId(allInstructionalVideos[0].title, token);
      })
      .then((returnedVideoId: string) => {
        videoId = returnedVideoId;
      });

    backoffice
      .visit()
      .logIn()
      .goToVideoPage()
      .findVideo(videoId)
      .goToEditPage()
      .editVideo()
      .validateVideoChange();
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
});
