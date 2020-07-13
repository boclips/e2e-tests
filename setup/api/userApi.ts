import { createContentPackage } from './contentPackageApi';
import { createApiIntegration } from './apiIntegrationApi';
import uuid = require('uuid');
import { API_URL } from '../Constants';

interface UserOptions {
  email: string;
  password: string;
}

export const createUserWithAccessRules = async (
  options: UserOptions,
  accessRuleIds: string[],
  token: string,
): Promise<Response | undefined> => {
  const packageId = await createContentPackage(
    { name: uuid.v4() + '-CONTENT_PACKAGE', accessRuleIds },
    token,
  );

  console.log(packageId);

  const organisationId = await createApiIntegration(
    {
      name: uuid.v4() + '-ORGANISATION',
      role: uuid.v4(),
      contentPackageId: packageId as string,
    },
    token,
  );

  console.log(organisationId);

  return await fetch(`${API_URL}/v1/e2e-users`, {
    method: 'POST',
    body: JSON.stringify({
      email: options.email,
      password: options.password,
      organisationId: organisationId,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};
