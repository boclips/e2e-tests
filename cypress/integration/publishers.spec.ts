import { PublishersPage } from '../page_objects/publishers/Publishers';
import { VideoPage } from '../page_objects/publishers/VideoPage';
import { CartPage } from '../page_objects/publishers/Cart';
import Video from '../page_objects/domain/Video';
import { generateTokenCypress } from '../../setup/generateToken';
import { YourOrdersPage } from '../page_objects/publishers/YourOrdersPage';
import { OrderPage } from '../page_objects/publishers/OrderPage';
import dateFormat from 'dateformat';

import {
  addLicenseToOrderItemCypress,
  getOrderCypress,
  updateOrderStatusCypress,
} from '../../setup/api/orderApi';
import { findVideosCypress } from '../../setup/api/videoApi';

context('Publishers', () => {
  const username = Cypress.env('HQ_USERNAME');
  const password = Cypress.env('HQ_PASSWORD');
  const publishersPage = new PublishersPage();
  const videoPage = new VideoPage();
  const cartPage = new CartPage();
  const yourOrdersPage = new YourOrdersPage();
  const orderPage = new OrderPage();
  let videos: Video[] = [];

  beforeEach(() => {
    generateTokenCypress(username, password).then(({ body }) => {
      findVideosCypress('query=of&duration=PT0S-PT1M', body.access_token).then(
        ({ body: { _embedded } }) => {
          videos = _embedded.videos;
        },
      );
    });
  });

  it('should apply filters', () => {
    const searchTerm: string = 'of';

    const videoToBeAddedAndRemoved = videos[0];
    const orderedVideo = videos[1];
    const secondOrderedVideo = videos[2];

    publishersPage
      .visit()
      .login()
      .search(searchTerm)
      .closeCookiesBanner()
      .applyFiltersAndWaitForResponse('Up to 1 min')
      .assertNumberOfVideosFound(videos.length)
      .addToCartByTitle(videoToBeAddedAndRemoved.title)
      .addToCartByTitle(orderedVideo.title)
      .removeFromCartByTitle(videoToBeAddedAndRemoved.title)
      .openVideoPageByTitle(secondOrderedVideo.title);

    videoPage.addToCart();
    publishersPage.goToCartPage().assertNumberOfItemsInCart(2);

    cartPage
      .addTrim(orderedVideo.id!, '0:01', '0:10')
      .enableTranscriptRequestedForItem(orderedVideo.id!)
      .enableCaptionsRequestedForItem(secondOrderedVideo.id!)
      .addOtherTypeOfEditingForItem(secondOrderedVideo.id!, 'make it shiny')
      .assertTotalPrice('$1,200')
      .clickPlaceOrder()
      .assertItemHasAdditionalServices(orderedVideo.id!, [
        'Trim: 0:01 - 0:10',
        'Transcripts requested',
      ])
      .assertItemHasAdditionalServices(secondOrderedVideo.id!, [
        'English captions requested',
        'Other type of editing: make it shiny',
      ])
      .clickConfirmOrder()
      .getOrderId()
      .then((placedOrderId) => {
        publishersPage.openYourOrdersPage();

        yourOrdersPage.assertOrderHasStatus(placedOrderId, 'PROCESSING');
        deliverOrder(placedOrderId);
        yourOrdersPage.openOrderPage(placedOrderId);

        orderPage
          .assertOrderDate(dateFormat(new Date(), 'dd/mm/yy'))
          .assertDeliveryDate(dateFormat(new Date(), 'dd/mm/yy'))
          .assertStatus('DELIVERED')
          .assertTotalPrice('$1,200')
          .assertItemHasAdditionalServices(orderedVideo.id!, [
            'Trim: 0:01 - 0:10',
            'Transcripts requested',
          ])
          .assertItemHasAdditionalServices(secondOrderedVideo.id!, [
            'English captions requested',
            'Other type of editing: make it shiny',
          ]);
      });
  });

  const deliverOrder = (orderId: string) => {
    return generateTokenCypress().then(({ body }) => {
      const token = body.access_token;
      getOrderCypress(orderId, token).then(({ body: { items } }) =>
        addLicenseToOrderItemCypress(orderId, items[0].id, token).then(() =>
          addLicenseToOrderItemCypress(orderId, items[1].id, token).then(() =>
            updateOrderStatusCypress(orderId, 'DELIVERED', token),
          ),
        ),
      );
    });
  };
});
