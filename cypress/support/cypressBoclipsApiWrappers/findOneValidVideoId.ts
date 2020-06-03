import { findOneVideoId } from '../../../setup/api/videoApi';
import { getParametrisedVideoFixtures } from '../../../setup/fixture/videos';
import { generateToken } from '../../../setup/generateToken';

export const findOneValidVideoId = () => {
  return cy
    .then(() => {
      return generateToken();
    })
    .then((token: string) => {
      return cy
        .then(() => {
          return getParametrisedVideoFixtures(token);
        })
        .then(allInstructionalVideos => {
          return findOneVideoId(allInstructionalVideos[0].title, token);
        });
    });
};
