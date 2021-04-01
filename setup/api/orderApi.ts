import * as Constants from '../Constants';

interface UpdateOrderItemRequest {
  license: {
    territory: string;
    duration: string;
  };
}

export function addLicenseToOrderItemCypress(
  orderId: string,
  itemId: string,
  token: string,
) {
  return updateOrderItemCypress(
    orderId,
    itemId,
    {
      license: { duration: '1', territory: 'everywhere' },
    },
    token,
  );
}

export function updateOrderStatusCypress(
  orderId: string,
  status: string,
  token: string,
) {
  return cy.request({
    method: 'PATCH',
    url: Constants.API_URL + `/v1/orders/${orderId}`,
    body: JSON.stringify({ status }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export function updateOrderItemCypress(
  orderId: string,
  itemId: string,
  updateOrderItemRequest: UpdateOrderItemRequest,
  token: string,
) {
  return cy.request({
    method: 'PATCH',
    url: Constants.API_URL + `/v1/orders/${orderId}/items/${itemId}`,
    body: JSON.stringify(updateOrderItemRequest),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export function getOrderCypress(orderId: string, token: string) {
  return cy.request({
    method: 'GET',
    url: Constants.API_URL + `/v1/orders/${orderId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}
