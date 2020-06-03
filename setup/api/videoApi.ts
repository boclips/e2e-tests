import fetch from 'node-fetch';
import * as Constants from '../Constants';
import { VideoFixture } from '../fixture/videos';
import { assertApiResourceCreation } from './utilities';

interface HypermediaWrapper {
  _embedded: Videos;
}

interface Videos {
  videos: Video[];
}

export interface Video {
  id: string;
  title: string;
}

export async function insertVideo(video: VideoFixture, token: string) {
  const response = await fetch(Constants.API_URL + '/v1/videos', {
    method: 'POST',
    body: JSON.stringify(video),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  await assertApiResourceCreation(response, 'Video creation');
}

export async function findOneVideoId(
  query: string,
  token: string,
): Promise<string> {
  const response = await fetch(
    Constants.API_URL + `/v1/videos?query=${query}&page=0&size=1`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const payload: HypermediaWrapper = await response.json();

  console.log('Single videos lookup result', payload);
  const video = payload._embedded.videos[0];
  return video.id;
}

export async function findVideos(
  query: string,
  token: string,
  attempts?: number,
): Promise<Video[]> {
  // Attempts logic implemented due to a race condition where videos are queried
  // straight after inserting and indexing did not finish in time.
  if (attempts === undefined) {
    attempts = 1;
  }
  if (attempts > 10) {
    throw new Error('Max query attempts reached');
  }

  const response = await fetch(
    Constants.API_URL + `/v1/videos?query=${query}&page=0&size=20`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const payload = await response.json();

  await assertApiResourceCreation(response, 'Videos lookup');

  if (payload._embedded.videos.length === 0) {
    await sleepForMillis(1000);
    return findVideos(query, token, attempts + 1);
  }

  return payload._embedded.videos;
}

async function sleepForMillis(millis: number): Promise<object> {
  return new Promise(resolve => setTimeout(resolve, millis));
}
