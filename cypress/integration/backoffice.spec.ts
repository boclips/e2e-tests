import { BackofficePage } from '../page_objects/backoffice/BackofficePage';

context('Backoffice', () => {
  const backoffice = new BackofficePage();

  it('Log in and view content partner page', () => {
    backoffice
      .visit()
      .logIn()
      .goToContentPartnerPage()
      .contentPartnerTableHasData();
  });

  it('Import an order CSV and set its currency', () => {
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

  it('Import job CSV and make sure the video ingestor picks it up', () => {
    backoffice
      .visit()
      .logIn()
      .goToIngestsPage()
      .importJobCSV()
      .jobsTableHasData()
      .goToFirstJobDetails()
      .videosTableHasVideo();
  });

  it('export a manifest', () => {
    backoffice
      .visit()
      .logIn()
      .goToOrdersPage()
      .exportOrderCSV();
  });
});
