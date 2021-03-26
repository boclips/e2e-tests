import { PublishersPage } from '../page_objects/publishers/Publishers';
import { VideoPage } from '../page_objects/publishers/VideoPage';
import { CartPage } from '../page_objects/publishers/Cart';
import Video from '../page_objects/domain/Video';
import { generateToken } from '../../setup/generateToken';
import { findVideos } from '../../setup/api/videoApi';

context('Publishers', () => {
  const publishersPage = new PublishersPage();
  const videoPage = new VideoPage();
  const cartPage = new CartPage();

  const searchTerm: string = 'of';

  it('should apply filters', async () => {
    const videos: Video[] = await getVideos();

    publishersPage
      .visit()
      .login()
      .search(searchTerm)
      .closeCookiesBanner()
      .applyFiltersAndWaitForResponse('Up to 1 min')
      .assertNumberOfVideosFound(videos.length)
      .addToCartByTitle(videos[0].title)
      .addToCartByTitle(videos[1].title)
      .removeFromCartByTitle(videos[0].title)
      .openVideoPageByTitle(videos[2].title);

    videoPage.addToCart();
    publishersPage.goToCartPage().assertNumberOfItemsInCart(2);

    cartPage
      .addTrim(videos[1].id!, '0:01', '0:10')
      .enableTranscriptRequestedForItem(videos[1].id!)
      .enableCaptionsRequestedForItem(videos[2].id!)
      .addOtherTypeOfEditingForItem(videos[2].id!, 'make it shiny')
      .assertTotalPrice('$1,200')
      .clickPlaceOrder()
      .assertItemHasAdditionalServices(videos[1].id!, [
        'Trim: 0:01 - 0:10',
        'Transcripts requested',
      ])
      .assertItemHasAdditionalServices(videos[2].id!, [
        'English captions requested',
        'Other type of editing: make it shiny',
      ])
      .clickConfirmOrder();
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
