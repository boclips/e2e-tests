import { VideoPage } from '../page_objects/boclips_web_app/VideoPage';
import { CartPage } from '../page_objects/boclips_web_app/Cart';
import Video from '../page_objects/domain/Video';
import { generateTokenCypress } from '../../setup/generateToken';
import { YourOrdersPage } from '../page_objects/boclips_web_app/YourOrdersPage';
import { OrderPage } from '../page_objects/boclips_web_app/OrderPage';

import {
  addLicenseToOrderItemCypress,
  getOrderCypress,
  updateOrderStatusCypress,
} from '../../setup/api/orderApi';
import { findVideosCypress } from '../../setup/api/videoApi';
import { BoclipsWebAppPage } from '../page_objects/boclips_web_app/BoclipsWebApp';

context('Boclips Web App', () => {
  const username = Cypress.env('HQ_USERNAME');
  const password = Cypress.env('HQ_PASSWORD');
  const boclipsWebAppPage = new BoclipsWebAppPage();
  const videoPage = new VideoPage();
  const cartPage = new CartPage();
  const yourOrdersPage = new YourOrdersPage();
  const orderPage = new OrderPage();
  let videos: Video[] = [];
  const searchTerm: string = 'the';

  beforeEach(() => {
    generateTokenCypress(username, password).then(({ body }) => {
      findVideosCypress(
        `query=${searchTerm}&duration=PT0S-PT1M`,
        body.access_token,
      ).then(({ body: { _embedded } }) => {
        videos = _embedded.videos;
      });
    });
  });

  it('should place order with additional services', () => {
    const orderedVideo = videos[1];
    const secondOrderedVideo = videos[2];

    boclipsWebAppPage
      .visit()
      .login()
      .search(searchTerm)
      .closeCookiesBanner()
      .applyFiltersAndWaitForResponse('Up to 1 min', searchTerm)
      .addToCartByTitle(orderedVideo.title)
      .openVideoPageByTitle(secondOrderedVideo.title);

    videoPage.addToCart();
    boclipsWebAppPage.goToCartPage().assertNumberOfItemsInCart(2);

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
        boclipsWebAppPage.openYourOrdersPage();

        yourOrdersPage.assertOrderHasStatus(placedOrderId, 'PROCESSING');
        deliverOrder(placedOrderId);
        yourOrdersPage.openOrderPage(placedOrderId);

        orderPage
          .assertOrderDate(getTodayFormatted())
          .assertDeliveryDate(getTodayFormatted())
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

  const getTodayFormatted = () =>
    new Date().toLocaleDateString('en-GB').replace('/202', '/2');
});
