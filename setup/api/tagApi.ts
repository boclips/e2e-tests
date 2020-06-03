import fetch from 'node-fetch';
import * as Constants from '../Constants';
import { Tag as FixtureTag } from '../fixture/tags';
import { Link } from './hateoas';
import { assertApiResourceCreation } from './utilities';

interface HypermediaWrapper {
  _embedded: Tags;
}

interface Tags {
  tags: Tag[];
}

export interface Tag {
  _links: TagLinks;
  id: string;
  label: string;
}

export interface TagLinks {
  self: Link;
}

export async function insertTag(tag: FixtureTag, token: string) {
  const response = await fetch(Constants.API_URL + '/v1/tags', {
    method: 'POST',
    body: JSON.stringify(tag),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  await assertApiResourceCreation(response, 'Tag creation');
}

export async function getTags(): Promise<Tag[] | undefined> {
  const response = await fetch(Constants.API_URL + '/v1/tags', {
    method: 'GET',
  });
  const payload: HypermediaWrapper = await response.json();

  if (payload && payload._embedded && payload._embedded.tags) {
    return payload._embedded.tags;
  } else {
    return undefined;
  }
}

export async function getTagByLabel(tagLabel: string): Promise<Tag> {
  const tags = await getTags();
  if (tags === undefined) {
    throw new Error('No tags found');
  }

  const tag = tags.find(s => s.label === tagLabel);
  if (tag === undefined) {
    throw new Error(`Tag not found for label ${tagLabel}`);
  }

  return tag;
}
