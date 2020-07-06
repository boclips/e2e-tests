import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../../page_objects/teachers';
import { clearLoginCookies } from '../../page_objects/teachers/CookiesUtils';

context('Teachers App Videos Journey', () => {
  const homepage = new TeachersHomepage();
  const username = `${uuid()}@boclips.com`;
  const password = `${uuid()}Aa1$`;
  const searchQuery = 'Minute Physics';
  const subjectFilter = 'Biology';

  specify(`video interactions are successful`, () => {
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
      .accountActivated()

      .log('Testing disabled videos')
      .menu()
      .search('Disabled')
      .noVideosShown()
      .menu()

      .search(searchQuery)

      .log('Testing pagination')
      .isOnPage(1)
      .goToPage(2)
      .isOnPage(2)
      .goToPage(1)
      .isOnPage(1)

      .log('Testing subject filtering')
      .applySubjectFilter(subjectFilter)
      .inspectResults((subjectVideos) => {
        expect(subjectVideos.length).to.be.eq(
          3,
          `There are three videos showing`,
        );
      })
      .removeFilterTag(subjectFilter)

      .log('Testing duration filtering')
      .menu()
      .search(searchQuery)
      .applyDurationFilter('0m - 2m')
      .inspectResults((durationVideos) => {
        expect(durationVideos.length).to.be.eq(
          8,
          `There are eight videos showing`,
        );
      })
      .removeFilterTag('0m - 2m')

      .log('testing video rating')
      .rateAndTagVideo(2, 'Hook')
      .assertRatingOnFirstVideo(2)
      .assertPedagogicalTagOnFirstVideo('Hook')
      .goToFirstVideo()
      .then((videoDetailsPage) => {
        videoDetailsPage
          .visit()
          .hasTitle()
          .hasContentPartnerName()
          .assertRating(2);
      });
  });
});
