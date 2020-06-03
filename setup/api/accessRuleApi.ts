import fetch from 'node-fetch';
import { API_URL } from '../Constants';
import { AccessRuleFixture, AccessRuleType } from '../fixture/accessRule';
import { Link } from './hateoas';
import {
  assertApiResourceCreation,
  assertApiResourceLookup,
  extractIdFromLocation,
} from './utilities';

export interface AccessRule {
  type: AccessRuleType;
  name: string;
  _links: AccessRuleLinks;
}

export interface AccessRuleLinks {
  self: Link;
}

export interface SelectedVideosAccessRule extends AccessRule {
  videoIds: string[];
}

interface HypermediaWrapper {
  _embedded: AccessRulesResource;
}

interface AccessRulesResource {
  accessRules: AccessRule[];
}

export async function ensureAccessRuleAndReturnId(
  accessRule: AccessRuleFixture,
  token: string,
): Promise<string> {
  let accessRuleId = await findAccessRuleIdByName(accessRule.name, token);

  if (!accessRuleId) {
    accessRuleId = await createAccessRule(accessRule, token);
  }

  return accessRuleId;
}

export async function findAccessRuleByName(
  name: string,
  token: string,
): Promise<AccessRule | undefined> {
  return fetch(`${API_URL}/v1/access-rules?name=${name}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(async response => {
    assertApiResourceLookup(response, `Access Rule [name=${name}]`);

    const payload: HypermediaWrapper = await response.json();
    const accessRules = payload._embedded.accessRules;

    const accessRule = accessRules.find((it: AccessRule) => it.name === name);

    return accessRule ? accessRule : undefined;
  });
}

export async function findAccessRuleIdByName(
  name: string,
  token: string,
): Promise<string | undefined> {
  const accessRule = await findAccessRuleByName(name, token);

  if (accessRule) {
    const self = accessRule._links.self.href;
    return self.substring(self.lastIndexOf('/') + 1);
  } else {
    return undefined;
  }
}

export async function createAccessRule(
  accessRuleFixture: AccessRuleFixture,
  token: string,
): Promise<string> {
  const response = await fetch(`${API_URL}/v1/access-rules`, {
    method: 'POST',
    body: JSON.stringify(accessRuleFixture),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  await assertApiResourceCreation(response, 'AccessRuleFixture creation');
  return extractIdFromLocation(response);
}
