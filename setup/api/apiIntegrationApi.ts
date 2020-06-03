import fetch from 'node-fetch';
import { API_URL } from '../Constants';
import { ApiIntegrationFixture } from '../fixture/apiIntegration';
import { LinksHolder } from './hateoas';
import {
  assertApiResourceCreation,
  assertApiResourceLookup,
  extractIdFromLocation,
  extractIdFromSelfUri,
} from './utilities';

type ApiIntegrationResource = LinksHolder & {
  name: string;
};

export async function ensureApiIntegrationAndReturnId(
  apiIntegration: ApiIntegrationFixture,
  token: string,
): Promise<string> {
  let apiIntegrationId = await findApiIntegrationIdByName(
    apiIntegration.name,
    token,
  );

  if (!apiIntegrationId) {
    apiIntegrationId = await createApiIntegration(apiIntegration, token);
  }

  return apiIntegrationId;
}

export async function findApiIntegrationIdByName(
  name: string,
  token: string,
): Promise<string | undefined> {
  return fetch(`${API_URL}/v1/api-integrations?name=${name}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(async response => {
    assertApiResourceLookup(response, `API integration [name=${name}]`);
    if (response.status === 404) {
      return undefined;
    }

    const apiIntegration: ApiIntegrationResource = await response.json();

    return extractIdFromSelfUri(apiIntegration._links.self.href);
  });
}

export async function createApiIntegration(
  apiIntegration: ApiIntegrationFixture,
  token: string,
): Promise<string> {
  const response = await fetch(`${API_URL}/v1/api-integrations`, {
    method: 'POST',
    body: JSON.stringify(apiIntegration),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  await assertApiResourceCreation(response, 'API Integration creation');
  return extractIdFromLocation(response);
}
