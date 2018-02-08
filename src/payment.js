import Syncano from 'syncano-server';
import {
  callEndpoint, checkRequestMethodType, configurePayPal,
  validateRequired
} from './utils/helpers';

export default async (ctx) => {
  const { data, response } = new Syncano(ctx);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { create_payment_details, update_payment_details, payment_id, ...list_details } = ctx.args;
  const actions = 'creating, retrieving and updating payments respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PUT', 'PATCH'];

  try {
    await configurePayPal(data);

    checkRequestMethodType(requestMethod, expectedMethodTypes, actions);

    if (requestMethod === 'POST') {
      validateRequired({ create_payment_details });
      const result = await callEndpoint('create', create_payment_details);
      const { statusCode, paypalResponse } = result;
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
    } else if (requestMethod === 'PATCH' || requestMethod === 'PUT') {
      validateRequired({ update_payment_details });
      const result = await callEndpoint('update', update_payment_details, payment_id);
      const { statusCode, paypalResponse } = result;
      response.json(paypalResponse, statusCode);
    }
  } catch (err) {
    const { error, message, statusCode, details } = err;
    if (error) {
      return response.json(error, statusCode);
    }
    if (details) {
      return response.json({ message, details }, 400);
    }
    return response.json({ message }, statusCode || 400);
  }
};
