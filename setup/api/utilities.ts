import { Response } from 'node-fetch';

export function extractIdFromSelfUri(uriString: string): string {
  return uriString.substring(uriString.lastIndexOf('/') + 1);
}

export function extractIdFromLocation(response: Response): string {
  const locationHeaderValue = response.headers.get('Location');
  if (!locationHeaderValue) {
    throw new Error('Unable to retrieve Location header value');
  }

  return extractIdFromSelfUri(locationHeaderValue);
}

export async function assertApiResourceCreation(
  response: Response,
  message: string = 'API call',
) {
  if (response.status < 400) {
    console.log(`😎 ${message} successful: ${response.status}`);
  } else if (response.status === 409) {
    console.log(
      `😍 ${message} ignored because it already exists: ${response.status}`,
    );
  } else {
    const body = await response.text();
    console.error(
      `The request to ${response.url} failed with status ${
        response.status
      }. See body below.`,
    );
    console.error(body);
    throw new Error(`💩 ${message} failed with status ${response.status}`);
  }
}

export function assertApiResourceLookup(
  response: Response,
  message: string = 'API call',
) {
  if (response.status < 400) {
    console.log(`😎 ${message} lookup successful: ${response.status}`);
  } else if (response.status === 404) {
    console.log(`🙆 ${message} cannot be found: ${response.status}`);
  } else {
    response.json().then(console.error);
    throw new Error(
      `💩 ${message} lookup failed with status ${response.status}`,
    );
  }
}

export function inserting(item: string) {
  console.log('');
  console.log(`⬇⬇⬇   Inserting all ${item}...   ⬇⬇⬇   `);
}
