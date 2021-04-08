let isCypressLoaded = false;
try {
  isCypressLoaded = !!Cypress;
} catch (e) {
  console.log('isCypressLoaded = false');
}

export const OPERATOR_USERNAME: string = isCypressLoaded
  ? Cypress.env('OPERATOR_USERNAME')
  : process.env.CYPRESS_OPERATOR_USERNAME;

export const OPERATOR_PASSWORD: string = isCypressLoaded
  ? Cypress.env('OPERATOR_PASSWORD')
  : process.env.CYPRESS_OPERATOR_PASSWORD;

export const SELECTED_VIDEOS_TEST_USERNAME: string = isCypressLoaded
  ? Cypress.env('SELECTED_VIDEOS_TEST_USERNAME')
  : process.env.CYPRESS_SELECTED_VIDEOS_TEST_USERNAME;

export const SELECTED_VIDEOS_TEST_PASSWORD: string = isCypressLoaded
  ? Cypress.env('SELECTED_VIDEOS_TEST_PASSWORD')
  : process.env.CYPRESS_SELECTED_VIDEOS_TEST_PASSWORD;

export const API_URL: string = isCypressLoaded
  ? Cypress.env('API_BASE_URL')
  : process.env.CYPRESS_API_BASE_URL;

export const TOKEN_URL: string = isCypressLoaded
  ? Cypress.env('TOKEN_URL')
  : process.env.CYPRESS_TOKEN_URL;
