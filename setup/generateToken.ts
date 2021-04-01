import fetch from 'node-fetch';
import { OPERATOR_PASSWORD, OPERATOR_USERNAME } from './Constants';

import { assertApiResourceCreation } from './api/utilities';
import * as Constants from './Constants';

interface AccessTokenResponse {
  access_token: string;
}

export async function generateToken(
  username: string = OPERATOR_USERNAME,
  password: string = OPERATOR_PASSWORD,
): Promise<string> {
  const response = await fetch(Constants.TOKEN_URL, {
    method: 'POST',
    body: `grant_type=password&client_id=boclips-admin&username=${username}&password=${password}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  await assertApiResourceCreation(
    response,
    `Token generation for user ${Constants.OPERATOR_USERNAME}`,
  );
  const body: AccessTokenResponse = await response.json();

  return body.access_token;
}

export function generateTokenCypress(
  username: string = OPERATOR_USERNAME,
  password: string = OPERATOR_PASSWORD,
) {
  return cy.request({
    method: 'POST',
    url: Constants.TOKEN_URL,
    body: `grant_type=password&client_id=boclips-admin&username=${username}&password=${password}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
