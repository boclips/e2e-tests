import { v4 as uuid } from 'uuid';
import { TeachersHomepage } from '../../page_objects/teachers';
import { clearLoginCookies } from '../../page_objects/teachers/CookiesUtils';

context('Teachers App - Student Journey', () => {
  const homepage = new TeachersHomepage();

  const username = `${uuid()}@boclips.com`;
  const password = `${uuid()}Aa1$`;

  const MINUTE_PHYSICS = 'Minute Physics';

  specify('video details are protected by a sharing code', () => {
    clearLoginCookies();
    homepage
      .configureHubspotCookie()
      .log('creating an account')
      .visitRegistrationPage()
      .createAccount(username, password)
      .accountCreated()
      .log('activating account')
      .activateAccount()
      .accountActivated()
      .menu()
      .search(MINUTE_PHYSICS)
      .goToFirstVideo()
      .then((page) => {
        clearLoginCookies();

        page
          .visit()
          .hasTitle()
          .hasContentPartnerName()
          .visitCopyLinkUrl()
          .showsSharingModal()
          .enterSharingCode()
          .showsNoSharingModal();
      });
  });
});
