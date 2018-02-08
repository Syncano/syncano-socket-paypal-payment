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

export {
  create_payment_params,
  update_payment_params,
  updated_insurance
};
