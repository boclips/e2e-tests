import { LtiDemoPage } from '../page_objects/lti_demo/LtiDemoPage';

context('LTI Demo', () => {
  const ltiDemo = new LtiDemoPage();

  it('should log in and request an LTI resource', () => {
    ltiDemo.visit().logIn().getResource();
  });

  it.only('should log in and embed a resource', () => {
    ltiDemo.visit().logIn().getSearchAndEmbedResource().searchVideo();
  });
});
