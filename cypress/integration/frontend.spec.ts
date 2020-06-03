import { Homepage } from '../page_objects/frontend/Homepage';

context('Frontend', () => {
  it('Publishers Functionality', () => {
    const homepage = new Homepage();
    const validSearchQuery =
      'Robert Neuwirth: The hidden world of shadow cities';
    homepage
      .visit()
      .logIn()
      .assertHubspotChat()
      .assertSuccessfulLogIn()
      .search(validSearchQuery)
      .showsVideo(videos => {
        expect(videos.length).to.be.greaterThan(
          0,
          `There are no videos showing`,
        );
      })
      .filterByEachSource()
      .filterByEachDuration();
  });
});
