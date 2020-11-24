import { LtiDemoPage } from '../page_objects/lti_demo/LtiDemoPage';

context('LTI Demo', () => {
  const ltiDemo = new LtiDemoPage();

  it('should log in and embed a resource', () => {
    ltiDemo.visit().logIn().getSearchAndEmbedResource().searchVideo();
  });

  it('should log in and embed collections resource', () => {
    ltiDemo.visit().logIn().getCollectionsResource().checkCollections();
  });
});
