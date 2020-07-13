export interface ApiIntegrationFixture {
  name: string;
  role: string;
  contentPackageId: string;
}

export function ltiApiIntegrationFixture(
  contentPackageId: string,
): ApiIntegrationFixture {
  return {
    name: 'E2E Tests LTI Api Integration',
    role: 'ROLE_TESTING_LTI',
    contentPackageId,
  };
}
