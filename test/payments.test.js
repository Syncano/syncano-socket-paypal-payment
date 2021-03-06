import request from 'supertest';
import { expect } from 'chai';
import { run, generateMeta } from '@syncano/test';
import 'dotenv/config';

import { create_payment_params, update_payment_params, updated_insurance } from './utils/helpers';

describe('payments', () => {
  const { PAYPAL_CONFIG_URL, PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
  const meta = generateMeta('payments');
  let payment_id = '';

  before((done) => {
    request(PAYPAL_CONFIG_URL)
      .post('/')
      .set({ 'X-API-KEY': meta.token, 'Content-Type': 'application/json' })
      .send({ PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  describe('POST', () => {
    it('should create payment successfully with valid parameters', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      run('payments', { args: { create_payment_details: create_payment_params }, meta })
        .then((res) => {
          const payment = res.data;
          payment_id = payment.id;

          expect(res.code).to.equal(201);
          expect(payment.id).to.contain('PAY-');

          expect(payment).to.have.property('links');
          expect(payment).to.have.property('transactions');
          // Validate tax information
          expect(payment.payer.payer_info.tax_id)
            .to.equal(create_payment_params.payer.payer_info.tax_id);
          expect(payment.payer.payer_info.tax_id_type)
            .to.equal(create_payment_params.payer.payer_info.tax_id_type);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should return "VALIDATION_ERROR" if payer parameter absent', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      const create_payment_details = { ...create_payment_params, payer: null };
      run('payments', { args: { create_payment_details }, meta })
        .then((res) => {
          expect(res.code).to.equal(400);
          expect(res.data.name).to.equal('VALIDATION_ERROR');
          expect(res.data).to.have.property('debug_id');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('PATCH', () => {
    it('should update payment successfully with valid parameters', (done) => {
      meta.request.REQUEST_METHOD = 'PATCH';
      run('payments', { args: { update_payment_details: update_payment_params, payment_id }, meta })
        .then((res) => {
          const updatedPayment = res.data;

          expect(res.code).to.equal(200);
          expect(updatedPayment.id).to.equal(payment_id);

          expect(updatedPayment).to.have.property('links');
          expect(updatedPayment).to.have.property('transactions');

          // Check for updated_insurance
          expect(updatedPayment.transactions[0].amount.details.insurance)
            .to.equal(updated_insurance);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('GET', () => {
    it('should return "INVALID_RESOURCE_ID" if payment id passed is invalid', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      run('payments', { args: { payment_id: 'INVALID_ID' }, meta })
        .then((res) => {
          expect(res.code).to.equal(404);
          expect(res.data).to.have.property('debug_id');
          expect(res.data).to.have.property('name');
          expect(res.data.name).to.equal('INVALID_RESOURCE_ID');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should show details for a payment if payment ID passed is valid', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      run('payments', { args: { payment_id }, meta })
        .then((res) => {
          expect(res.code).to.equal(200);
          expect(res.data.id).to.equal(payment_id);

          expect(res.data).to.have.property('links');
          expect(res.data).to.have.property('transactions');
          expect(res.data.intent).to.equal('sale');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should list payments created if payment_id not passed as params', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      run('payments', { args: { count: 3 }, meta })
        .then((res) => {
          expect(res.code).to.equal(200);
          expect(res.data).to.have.property('payments');
          expect(res.data).to.have.property('count');
          expect(res.data.payments).to.be.an.instanceof(Array);
          expect(res.data.payments.length).to.be.at.most(3);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('Invalid request method', () => {
    it('should return an error if request method is of type `DELETE`', (done) => {
      meta.request.REQUEST_METHOD = 'DELETE';
      run('payments', { meta })
        .then((res) => {
          const errorMessage =
            'Make sure to use POST, GET, PATCH for creating, retrieving and updating payments respectively.';
          expect(res.code).to.equal(400);
          expect(res.data.message).to.equal(errorMessage);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
