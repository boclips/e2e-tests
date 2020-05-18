import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../../page_objects/teachers';
import {
  clearLoginCookies,
  preserveLoginCookiesBetweenTests,
} from '../../page_objects/teachers/CookiesUtils';

context('Teachers App Videos Journey', () => {
  const homepage = new TeachersHomepage();

  const username = `${uuid()}@boclips.com`;
  const password = `${uuid()}Aa1$`;

  const MINUTE_PHYSICS = 'Minute Physics';
  const SUBJECT = 'Biology';

  before(() => {
    clearLoginCookies();
    homepage
      .configureHubspotCookie()
      .log('creating an account')
      .visitRegistrationPage()
      .createAccount(username, password)
      .accountCreated()

      .log('logging in')
      .visit()
      .logIn(username, password)

      .log('activating account')
      .activateAccount()
      .accountActivated();
  });

  beforeEach(preserveLoginCookiesBetweenTests);

  beforeEach(() => {
    homepage.reload();
  });

  specify('Searching non educational videos', () => {
    const nonEducationalSearchQuery = 'Celebrities on the red carpet';
    homepage
      .log('searching non educational videos')
      .menu()
      .search(nonEducationalSearchQuery)
      .noVideosShown();
  });

  specify('Searching non streaming videos', () => {
    const disabledVideoSearchQuery = 'Disabled';
    homepage
      .log('searching non streaming')
      .menu()
      .search(disabledVideoSearchQuery)
      .noVideosShown();
  });

  specify('Search result pagination check', () => {
    homepage
      .menu()
      .search(MINUTE_PHYSICS)
      .isOnPage(1)
      .goToPage(2)
      .isOnPage(2)
      .goToPage(1)
      .isOnPage(1);
  });

  specify('Subject filter in search', () => {
    homepage
      .menu()
      .search(MINUTE_PHYSICS)
      .applySubjectFilter(SUBJECT)
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(3, `There are three videos showing`);
      })
      .removeFilterTag(SUBJECT);
  });

  specify('Duration filter in search', () => {
    homepage
      .visit()
      .menu()
      .search(MINUTE_PHYSICS)
      .applyDurationFilter('0m - 2m')
      .inspectResults(videos => {
        expect(videos.length).to.be.eq(8, `There are eight videos showing`);
      })
      .removeFilterTag('0m - 2m');
  });

  specify.skip('Age range filter in search', () => {
    homepage
      .visit()
      .menu()
      .search(MINUTE_PHYSICS)
      .applyAgeRangeFilter('3 - 5', '3-5')
      .inspectResults(videos => {
        expect(videos.length).to.be.greaterThan(
          2,
          `There are more than two videos showing up for the age range 3-5`,
        );
      })
      .removeFilterTag('3-5');
  });

  specify('Video Rating', () => {
    homepage
      .visit()
      .menu()
      .search(MINUTE_PHYSICS)
      .log('testing video rating')
      .rateAndTagVideo(2, 'Hook')
      .assertRatingOnFirstVideo(2)
      .assertPedagogicalTagOnFirstVideo('Hook')
      .goToFirstVideo()
      .then(videoDetailsPage => {
        videoDetailsPage
          .visit()
          .hasTitle()
          .hasContentPartnerName()
          .assertRating(2);
      });
  });
});
