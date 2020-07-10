import fetch from 'node-fetch';
import * as Constants from '../Constants';
import { API_URL } from '../Constants';
import { assertApiResourceCreation } from './utilities';

interface HypermediaWrapper {
  _links: any;
  _embedded: Channels;
}

interface Channels {
  channels: Channel[];
}

export interface Channel {
  name: string;
  id?: string;
  accreditedToYtChannelId?: string;
  ageRange?: any;
  distributionMethods?: string[];
  currency?: string;
  contractId?: string;
}

export async function insertChannel(channel: Channel, token: string) {
  const response = await fetch(Constants.API_URL + '/v1/channels', {
    method: 'POST',
    body: JSON.stringify(channel),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  await assertApiResourceCreation(response, 'Channel creation');
}

export async function getChannels(
  token: string,
): Promise<Channel[] | undefined> {
  const response = await fetch(`${API_URL}/v1/channels`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const payload: HypermediaWrapper = await response.json();

  if (payload && payload._embedded && payload._embedded.channels) {
    return payload._embedded.channels;
  } else {
    return undefined;
  }
}
