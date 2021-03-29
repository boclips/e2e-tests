import { PublishersPage } from '../page_objects/publishers/Publishers';
import { VideoPage } from '../page_objects/publishers/VideoPage';
import { CartPage } from '../page_objects/publishers/Cart';
import Video from '../page_objects/domain/Video';
import { generateToken } from '../../setup/generateToken';
import { findVideos } from '../../setup/api/videoApi';
import { YourOrdersPage } from '../page_objects/publishers/YourOrdersPage';
import { OrderPage } from '../page_objects/publishers/OrderPage';

context('Publishers', () => {
  const publishersPage = new PublishersPage();
  const videoPage = new VideoPage();
  const cartPage = new CartPage();
  const yourOrdersPage = new YourOrdersPage();
  const orderPage = new OrderPage();

  it('should apply filters', async () => {
    const searchTerm: string = 'of';

    const videos: Video[] = await getVideos();
    const orderedVideo = videos[1];
    const secondOrderedVideo = videos[2];

    publishersPage
      .visit()
      .login()
      .search(searchTerm)
      .closeCookiesBanner()
      .applyFiltersAndWaitForResponse('Up to 1 min')
      .assertNumberOfVideosFound(videos.length)
      .addToCartByTitle(videos[0].title)
      .addToCartByTitle(orderedVideo.title)
      .removeFromCartByTitle(videos[0].title)
      .openVideoPageByTitle(secondOrderedVideo.title);

    videoPage.addToCart();
    publishersPage.goToCartPage().assertNumberOfItemsInCart(2);

    cartPage
      .addTrim(videos[1].id!, '0:01', '0:10')
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

        yourOrdersPage
          .assertOrderHasStatus(placedOrderId, 'PROCESSING')
          .openOrderPage(placedOrderId);

        orderPage
          .assertOrderDate(new Date().toLocaleDateString('en-GB'))
          .assertStatus('PROCESSING')
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

  const getVideos = async () => {
    return await generateToken(
      Cypress.env('HQ_USERNAME'),
      Cypress.env('HQ_PASSWORD'),
    )
      .then(async (freshToken: string) => {
        return await findVideos('of&duration=PT0S-PT1M', freshToken);
      })
      .catch(() => []);
  };
});
