const discount_amount = '-2.00';
const shipping = '2.00';
const handling_fee = '1.00';
const insurance = '1.00';
const shipping_discount = '1.00';

const updated_insurance = '4.00';

const create_payment_params = {
  intent: 'sale',
  redirect_urls: {
    return_url: 'http://www.return.com',
    cancel_url: 'http://www.cancel.com'
  },
  payer: {
    payment_method: 'paypal',
    payer_info: {
      tax_id_type: 'BR_CPF',
      tax_id: 'Fh618775690'
    }
  },
  transactions: [
    {
      amount: {
        total: '34.07',
        currency: 'USD',
        details: {
          subtotal: '30.00',
          tax: '0.07',
          shipping,
          handling_fee,
          insurance
        }
      },
      description: 'This is the payment transaction description.',
      custom: 'EBAY_EMS_90048630024435',
      invoice_number: '48787589677',
      payment_options: {
        allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
      },
      soft_descriptor: 'ECHI5786786',
      item_list: {
        items: [
          {
            name: 'bowling',
            description: 'Bowling Team Shirt',
            quantity: '5',
            price: '3',
            tax: '0.01',
            sku: '1',
            currency: 'USD'
          },
          {
            name: 'mesh',
            description: '80s Mesh Sleeveless Shirt',
            quantity: '1',
            price: '17',
            tax: '0.02',
            sku: 'product34',
            currency: 'USD'
          },
          {
            name: 'discount',
            quantity: '1',
            price: discount_amount,
            sku: 'product',
            currency: 'USD'
          }
        ],
        shipping_address: {
          recipient_name: 'Betsy Buyer',
          line1: '111 First Street',
          city: 'Saratoga',
          country_code: 'US',
          postal_code: '95070',
          state: 'CA'
        }
      }
    }
  ]
};

const update_payment_params = [
  {
    op: 'replace',
    path: '/transactions/0/amount',
    value: {
      total: '36.07',
      currency: 'USD',
      details: {
        subtotal: '30.00',
        tax: '0.07',
        shipping,
        handling_fee,
        shipping_discount,
        insurance: updated_insurance
      }
    }
  }
];

const execute_payment_response =
  {
    id: 'PAY-9N9834337A9191208KOZOQWI',
    create_time: '2017-07-01T16:56:57Z',
    update_time: '2017-07-01T17:05:41Z',
    state: 'approved',
    intent: 'order',
    payer: {
      payment_method: 'paypal',
      payer_info: {
        email: 'qa152-biz@example.com',
        first_name: 'Thomas',
        last_name: 'Miller',
        payer_id: 'PUP87RBJV8HPU',
        shipping_address: {
          line1: '4th Floor, One Lagoon Drive',
          line2: 'Unit #34',
          city: 'Redwood City',
          state: 'CA',
          postal_code: '94065',
          country_code: 'US',
          phone: '011862212345678',
          recipient_name: 'Thomas Miller'
        }
      }
    },
    transactions: [
      {
        amount: {
          total: '41.15',
          currency: 'USD',
          details: {
            subtotal: '30.00',
            tax: '0.15',
            shipping: '11.00'
          }
        },
        description: 'The payment transaction description.',
        item_list: {
          items: [
            {
              name: 'hat',
              sku: '1',
              price: '3.00',
              currency: 'USD',
              quantity: '5'
            },
            {
              name: 'handbag',
              sku: 'product34',
              price: '15.00',
              currency: 'USD',
              quantity: '1'
            }
          ],
          shipping_address: {
            recipient_name: 'Thomas Miller',
            line1: '4th Floor, One Lagoon Drive',
            line2: 'Unit #34',
            city: 'Redwood City',
            state: 'CA',
            phone: '011862212345678',
            postal_code: '94065',
            country_code: 'US'
          }
        },
        related_resources: [
          {
            order: {
              id: 'O-3SP845109F051535C',
              create_time: '2017-07-01T16:56:58Z',
              update_time: '2017-07-01T17:05:41Z',
              state: 'pending',
              amount: {
                total: '41.15',
                currency: 'USD'
              },
              parent_payment: 'PAY-9N9834337A9191208KOZOQWI',
              links: [
                {
                  href: 'https://api.sandbox.paypal.com/v1/payments/orders/O-3SP845109F051535C',
                  rel: 'self',
                  method: 'GET'
                },
                {
                  href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAY-9N9834337A9191208KOZOQWI',
                  rel: 'parent_payment',
                  method: 'GET'
                },
                {
                  href: 'https://api.sandbox.paypal.com/v1/payments/orders/O-3SP845109F051535C/void',
                  rel: 'void',
                  method: 'POST'
                },
                {
                  href: 'https://api.sandbox.paypal.com/v1/payments/orders/O-3SP845109F051535C/authorize',
                  rel: 'authorization',
                  method: 'POST'
                },
                {
                  href: 'https://api.sandbox.paypal.com/v1/payments/orders/O-3SP845109F051535C/capture',
                  rel: 'capture',
                  method: 'POST'
                }
              ]
            }
          }
        ]
      }
    ],
    links: [
      {
        href: 'https://api.sandbox.paypal.com/v1/payments/payment/PAY-9N9834337A9191208KOZOQWI',
        rel: 'self',
        method: 'GET'
      }
    ]
  };


export {
  create_payment_params,
  update_payment_params,
  updated_insurance,
  execute_payment_response
};
