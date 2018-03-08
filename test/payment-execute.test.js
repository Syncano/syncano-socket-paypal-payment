import request from 'supertest';
import { expect } from 'chai';
import nock from 'nock';
import 'dotenv/config';

import { execute_payment_response } from './utils/helpers';

const args = { payment_id: 'PAY-9N9834337A9191208KOZOQWI', payer_id: 'CR87QHB7JTRSC' };

describe('execute-payment', () => {
  const { SOCKET_PAYMENT_EXECUTE_URL } = process.env;

  it('should execute a PayPal payment that the customer has approved', (done) => {
    nock(SOCKET_PAYMENT_EXECUTE_URL)
      .post('/', args)
      .reply(200, execute_payment_response);

    request(SOCKET_PAYMENT_EXECUTE_URL)
      .post('/')
      .send(args)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const payment = res.body;
        expect(payment.id).to.contain('PAY-');
        expect(payment).to.have.property('state');
        expect(payment).to.have.property('intent');
        expect(payment.state).to.equal('approved');
        done();
      });

    nock.cleanAll();
  });
});
