import Syncano from 'syncano-server';
import { callEndpoint, checkRequestMethodType, configurePayPal } from './utils/helpers';

export default async (ctx) => {
  const { data, response } = Syncano(ctx);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { paymentDetails, paymentID } = ctx.args;
  const actions = 'creating, retrieving and updating payments respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PUT'];

  try {
    await configurePayPal(data);

    checkRequestMethodType(requestMethod, expectedMethodTypes, actions);

    if (requestMethod === 'POST') {
      try {
        const result = await callEndpoint('create', paymentDetails);
        const { statusCode, paypalResponse } = result;
        response.json(paypalResponse, statusCode);
      } catch (err) {
        const { statusCode, error } = err;
        response.json(error, statusCode);
      }
    } else if (requestMethod === 'GET') {
      try {
        let result;
        if (paymentID) {
          result = await callEndpoint('get', null, paymentID);
        } else {
          result = await callEndpoint('list');
        }
        const { statusCode, paypalResponse } = result;
        response.json(paypalResponse, statusCode);
      } catch (err) {
        const { statusCode, error } = err;
        response.json(error, statusCode);
      }
    } else if (requestMethod === 'PATCH' || requestMethod === 'PUT') {
      try {
        const result = await callEndpoint('update', paymentDetails, paymentID);
        const { statusCode, paypalResponse } = result;
        response.json(paypalResponse, statusCode);
      } catch (err) {
        const { statusCode, error } = err;
        response.json(error, statusCode);
      }
    }
  } catch (err) {
    const { message, details, status } = err;
    if (details) {
      return response.json({ message, details }, 400);
    }
    if (status) {
      return response.json({ message }, status);
    }
    return response.json({ message }, 400);
  }
};
