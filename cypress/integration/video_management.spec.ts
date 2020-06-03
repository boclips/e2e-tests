import { VideoManagementPage } from '../page_objects/video_management/VideoManagementPage';

context('Video Management', () => {
  xit('searching for videos journey', () => {
    const videoManagementPage = new VideoManagementPage();
    videoManagementPage
      .visit()
      .logIn()
      .search('535')
      .showsVideo(videos => {
        expect(videos.length).to.equal(1);
        const [video] = videos;
        expect(video.id).to.equal('535');
        expect(video.title).to.equal('Richard St. John: 8 secrets of success');
        expect(video.contentPartner).to.equal('Minute Physics');
      });
  });
});
