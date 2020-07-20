import { findVideos, Video } from '../../setup/api/videoApi';
import { generateToken } from '../../setup/generateToken';
import uuid = require('uuid');
import { createUserWithContentPackage } from '../../setup/api/userApi';
import {
  includedVideosAccessRuleFixture,
  includedChannelsAccessRuleFixture,
} from '../../setup/fixture/accessRuleHelpers';
import { createContentPackage } from '../../setup/api/contentPackageApi';

context('Video Access Rules', () => {
  let token: string;

  beforeEach(() => {
    return generateToken().then(async (freshToken: string) => {
      token = freshToken;
    });
  });

  it('limits users to permitted videos only', async () => {
    const allVideos = await findVideos('', token);

    const videoIds = [allVideos[0].id];
    const includedVideosContentPackage = await createContentPackage(
      {
        name: 'permitted videos',
        accessRules: [
          includedVideosAccessRuleFixture(
            videoIds,
            `${uuid.v4()} good videos only`,
          ),
        ],
      },
      token,
    );

    const { email, password } = generateEmailAndPassword();

    await createUserWithContentPackage(
      { email, password },
      includedVideosContentPackage!,
      token,
    );

    const queriedVideos = await findVideosAsUser(email, password);

    expect(queriedVideos.length).to.equal(1);
    expect(queriedVideos.map((it) => it.id)).to.deep.equal(videoIds);
  });

  it('limits users to permitted channesl only', async () => {
    const allVideos = await findVideos('', token);
    const chosenChannel = {
      channelId: allVideos[0].channelId,
      channelName: allVideos[0].createdBy,
    };

    const channelsOnlyContentPackageId = await createContentPackage(
      {
        name: 'included channels',
        accessRules: [
          includedChannelsAccessRuleFixture(
            [chosenChannel.channelId],
            `${uuid.v4()} channel access rule`,
          ),
        ],
      },
      token,
    );

    const { email, password } = generateEmailAndPassword();

    await createUserWithContentPackage(
      { email, password },
      channelsOnlyContentPackageId!,
      token,
    );
    const queriedVideos = await findVideosAsUser(email, password);

    const videosWithCorrectChannel = queriedVideos.filter(
      (it) => it.createdBy == chosenChannel.channelName,
    );
    expect(queriedVideos.length).equals(videosWithCorrectChannel.length);
  });

  it('limits users to channels and videos', async () => {
    const allVideos = await findVideos('', token);
    const chosenChannel = {
      channelId: allVideos[0].channelId,
      channelName: allVideos[0].createdBy,
    };

    const chosenVideo = allVideos.filter(
      (it) => it.channelId != chosenChannel.channelId,
    )[0];

    const contentPackage = await createContentPackage(
      {
        name: 'permitted videos and channels',
        accessRules: [
          includedVideosAccessRuleFixture(
            [chosenVideo.id],
            `${uuid.v4()} good videos only`,
          ),
          includedChannelsAccessRuleFixture(
            [chosenChannel.channelId],
            `${uuid.v4()} channel access rule`,
          ),
        ],
      },
      token,
    );

    const { email, password } = generateEmailAndPassword();

    await createUserWithContentPackage(
      { email, password },
      contentPackage!,
      token,
    );
    const queriedVideos = await findVideosAsUser(email, password);

    const matchingChannels = queriedVideos.filter(
      (it) => it.channelId == chosenChannel.channelId,
    );
    const matchingVideos = queriedVideos.filter(
      (it) => it.id == chosenVideo.id,
    );

    expect(matchingVideos.length).to.equal(1);
    expect(matchingVideos[0].title).to.equal(chosenVideo.title);

    expect(matchingChannels.length + matchingVideos.length).to.equal(
      queriedVideos.length,
    );
  });
});

const findVideosAsUser = async (
  email: string,
  password: string,
): Promise<Video[]> => {
  const userToken = await generateToken(email, password);
  return await findVideos('', userToken);
};
function generateEmailAndPassword() {
  const email = `${uuid.v4()}@hello.com`;
  const password = uuid.v4();
  return { email, password };
}
