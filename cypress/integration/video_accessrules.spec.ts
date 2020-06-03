import {
  findAccessRuleByName,
  SelectedVideosAccessRule,
} from '../../setup/api/accessRuleApi';
import { findVideos } from '../../setup/api/videoApi';
import {
  SELECTED_VIDEOS_TEST_PASSWORD,
  SELECTED_VIDEOS_TEST_USERNAME,
} from '../../setup/Constants';
import { INCLUDED_VIDEOS_ACCESS_RULE_NAME } from '../../setup/fixture/accessRule';
import { generateToken } from '../../setup/generateToken';

context('Video Access Rules', () => {
  it('Available videos are limited to permitted ones only', async () => {
    const token = await generateToken(
      SELECTED_VIDEOS_TEST_USERNAME,
      SELECTED_VIDEOS_TEST_PASSWORD,
    );
    const accessRule = (await findAccessRuleByName(
      INCLUDED_VIDEOS_ACCESS_RULE_NAME,
      token,
    )) as SelectedVideosAccessRule;
    const videos = await findVideos('Minute Physics', token);
    expect(videos.map(it => it.id)).to.deep.equal(accessRule.videoIds);
  });
});
