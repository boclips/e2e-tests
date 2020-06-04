import fetch from 'node-fetch';
import * as Constants from '../Constants';
import { API_URL } from '../Constants';
import { assertApiResourceCreation } from './utilities';

interface HypermediaWrapper {
  _links: any;
  _embedded: ContentPartnerContracts;
}

interface ContentPartnerContracts {
  contracts: ContentPartnerContract[];
}

export interface ContentPartnerContract {
  name: string;
  id?: string;
}

export async function insertContentPartnerContract(token: string) {
  const response = await fetch(
    Constants.API_URL + '/v1/content-partner-contracts',
    {
      method: 'POST',
      body: JSON.stringify({
        contentPartnerName: 'Default Contract',
        contractDocument: 'http://server.com/oranges.png',
        contractDates: {
          start: '2010-12-31',
          end: '2011-01-31',
        },
        daysBeforeTerminationWarning: 30,
        yearsForMaximumLicense: 4,
        daysForSellOffPeriod: 12,
        royaltySplit: {
          download: 19.333333,
          streaming: 50,
        },
        minimumPriceDescription: 'Minimum prices are cool',
        remittanceCurrency: 'GBP',
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  await assertApiResourceCreation(
    response,
    'Content partner contract creation',
  );
}

export async function getContentPartnerContracts(
  token: string,
): Promise<ContentPartnerContract[] | undefined> {
  const response = await fetch(`${API_URL}/v1/content-partner-contracts`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const payload: HypermediaWrapper = await response.json();

  if (payload && payload._embedded && payload._embedded.contracts) {
    return payload._embedded.contracts;
  } else {
    return undefined;
  }
}
