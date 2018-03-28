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

  try {
    await configurePayPal(data);

    checkRequestMethodType(requestMethod, ['POST', 'GET', 'PATCH'], actionsMessage);

    if (requestMethod === 'POST') {
      validateRequired({ create_payment_details });
      const { statusCode, paypalResponse } = await callEndpoint('create', create_payment_details);
      return response.json(paypalResponse, statusCode);
    } else if (requestMethod === 'GET') {
      let result;
      if (payment_id) {
        result = await callEndpoint('get', null, payment_id);
      } else {
        result = await callEndpoint('list', list_details);
      }
      const { statusCode, paypalResponse } = result;
      return response.json(paypalResponse, statusCode);
    } else if (requestMethod === 'PATCH') {
      validateRequired({ update_payment_details });
      const { statusCode, paypalResponse } = await callEndpoint('update', update_payment_details, payment_id);
      return response.json(paypalResponse, statusCode);
    }
  } catch ({ error, statusCode, ...errorDetails }) {
    return response.json(error || errorDetails, statusCode || 400);
  }
};
