import Syncano from '@syncano/core';
import {
  callEndpoint, checkRequestMethodType, configurePayPal,
  validateRequired
} from './utils/helpers';

export default async (ctx) => {
  const { data, response } = new Syncano(ctx);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { create_payment_details, update_payment_details, payment_id, ...list_details } = ctx.args;
  const actionsMessage = 'creating, retrieving and updating payments respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PATCH'];

  try {
    await configurePayPal(data);

    checkRequestMethodType(requestMethod, expectedMethodTypes, actionsMessage);

    if (requestMethod === 'POST') {
      validateRequired({ create_payment_details });
      const { statusCode, paypalResponse } = await callEndpoint('create', create_payment_details);
      response.json(paypalResponse, statusCode);
    } else if (requestMethod === 'GET') {
      let result;
      if (payment_id) {
        result = await callEndpoint('get', null, payment_id);
      } else {
        result = await callEndpoint('list', list_details);
      }
      const { statusCode, paypalResponse } = result;
      response.json(paypalResponse, statusCode);
    } else if (requestMethod === 'PATCH') {
      validateRequired({ update_payment_details });
      const { statusCode, paypalResponse } = await callEndpoint('update', update_payment_details, payment_id);
      response.json(paypalResponse, statusCode);
    }
  } catch ({ error, message, statusCode, details }) {
    if (error) {
      return response.json(error, statusCode);
    }
    if (details) {
      return response.json({ message, details }, 400);
    }
    return response.json({ message }, statusCode || 400);
  }
};
