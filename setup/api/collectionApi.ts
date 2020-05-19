import fetch from 'node-fetch';
import URI from 'urijs';
import 'urijs/src/URITemplate';
import { API_URL } from '../Constants';
import { CollectionFixture } from '../fixture/collections';
import { LinksHolder } from './hateoas';
import { assertApiResourceCreation, extractIdFromLocation } from './utilities';

interface HypermediaWrapper {
  _embedded: Collections;
}

interface Collections {
  collections: Collection[];
}

export interface Collection {
  id: string;
  title: string;
  promoted?: boolean;
}

export async function ensureCollectionAndReturnId(
  collection: CollectionFixture,
  token: string,
): Promise<string> {
  let collectionId = await findOneCollectionId(collection.title, token);

  if (!collectionId) {
    collectionId = await insertCollection(collection, token);
  }

  return collectionId;
}

export async function insertCollection(
  collection: CollectionFixture,
  token: string,
): Promise<string> {
  const response = await fetch(`${API_URL}/v1/collections`, {
    method: 'POST',
    body: JSON.stringify(collection),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  await assertApiResourceCreation(response, 'Collection creation');
  const id = extractIdFromLocation(response);

  if (collection.promoted) {
    console.log(`🤩 Promoting collection [name=${collection.title}]`);
    await fetch(`${API_URL}/v1/collections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(collection),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  return id;
}

export async function getCollections(
  token: string,
): Promise<Collection[] | undefined> {
  const response = await fetch(API_URL + '/v1/collections', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const payload = await response.json();
  if (payload && payload._embedded && payload._embedded.collections) {
    return payload._embedded.collections;
  } else {
    return undefined;
  }
}

export async function addVideoToCollection(
  collectionId: string,
  videoId: string,
  token: string,
) {
  const response = await fetch(
    `${API_URL}/v1/collections/${collectionId}/videos/${videoId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  await assertApiResourceCreation(
    response,
    `Video/Collection association [${collectionId}/${videoId}]`,
  );
}

export async function findOneCollectionId(
  name: string,
  token: string,
  promoted?: boolean,
): Promise<string | undefined> {
  const searchCollectionsUri = await getCollectionsLink(token);

  const url = URI.expand(searchCollectionsUri, {})
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  await assertApiResourceCreation(response, `Collection lookup [name=${name}]`);

  const payload: HypermediaWrapper = await response.json();
  const collections = payload._embedded.collections;

  const collection = collections.find((it: Collection) => it.title === name);

  if (collection && (promoted ? collection.promoted === promoted : true)) {
    return collection.id;
  } else {
    return undefined;
  }
}

async function getCollectionsLink(token: string): Promise<string> {
  const response = await fetch(`${API_URL}/v1`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  await assertApiResourceCreation(response, 'Links lookup');

  const payload: LinksHolder = await response.json();

  return payload._links.searchCollections.href;
}
