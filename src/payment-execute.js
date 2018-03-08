import Syncano from 'syncano-server';
import {
  callEndpoint, checkRequestMethodType, configurePayPal,
  validateRequired
} from './utils/helpers';

export default async (ctx) => {
  const { data, response } = new Syncano(ctx);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { payer_id, payment_id, transactions } = ctx.args;
  const actionsMessage = 'for executing a payment';

  try {
    await configurePayPal(data);

    checkRequestMethodType(requestMethod, ['POST'], actionsMessage);

    validateRequired({ payer_id, payment_id });

    const { statusCode, paypalResponse } = await callEndpoint('execute', { payer_id, transactions }, payment_id);
    response.json(paypalResponse, statusCode);
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
