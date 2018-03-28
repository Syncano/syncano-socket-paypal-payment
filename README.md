# paypal-payment
[![CircleCI](https://circleci.com/gh/Syncano/syncano-socket-paypal-payment.svg?style=svg)](https://circleci.com/gh/Syncano/syncano-socket-paypal-payment)

`version:` **0.0.1**

Integrate paypal REST API for payment endpoints

To install, run:

```
npx s add paypal-payment
```

## Endpoints

### payments

Create, get, list and Update actions for paypal payment.

#### Parameters

| name | type | description | example | long_description
| ---- | ---- | ----------- | ------- | ----------------
| create_payment_details | object | Payment detail parameters for creating payment | {   "intent": "sale",   "payer": {     "payment_method": "paypal"   },   "redirect_urls": {     "return_url": "http://return.url",     "cancel_url": "http://cancel.url"   },   "transactions": [{     "item_list": {       "items": [{         "name": "item",         "sku": "item",         "price": "1.00",         "currency": "USD",         "quantity": 1       }]     },     "amount": {       "currency": "USD",       "total": "1.00"     },     "description": "This is the payment description."   }] }  | 
| update_payment_details | array | An array of JSON patch objects to apply partial updates to payment | [   {     "op":  "replace",     "path": "/transactions/0/amount",     "value": {       "total": "36.07",       "currency": "USD",       "details": {         "subtotal": "30.00",         "tax": "0.07",         "shipping": "2.00,         "handling_fee": "1.00",         "shipping_discount": "1.00",         "insurance": "4.00"       }     }   } ]  | 
| payment_id | string | The ID of the payment to update or retrieve. | PAY-5YK922393D847794YKER7MUI | Note that this is required for get and update and shouldn't be passed for create or list payaments. 
| count | integer | The number of items to list in the response (Optional for listing Payment) | 10 | 
| start_index | integer | The start index of the payments to list (Optional for listing Payment) | 2 | 
| start_id | string | The ID of the starting resource in the response (Optional for listing Payment) |  | 
| start_time | string | The start date and time for the range to show in the response (Optional for listing Payment) | 2016-03-06T11:00:00Z | 
| end_time | string | The end date and time for the range to show in the response (Optional for listing Payment) | 2016-03-06T11:00:00Z | 
| payee_id | string | Filters the payments in the response by a PayPal-assigned merchant ID that identifies the payee (List Payment) |  | 
| sort_by | string | Sorts the payments in the response by a create time (Optional for listing Payment) | create_time | 
| sort_order | string | Sorts the payments in the response in descending order (Optional for listing Payment) | desc | 



#### Response

mimetype: `application/json`

##### Success `200`

```
{
  "id": "PAY-1B56960729604235TKQQIYVY",
  "create_time": "2017-09-22T20:53:43Z",
  "update_time": "2017-09-22T20:53:44Z",
  "state": "created",
  "intent": "sale",
  "payer": {
    "payment_method": "paypal"
  },
  "httpStatusCode": 201
  ...
}
```

##### Failed `400`

```
{
  "name": "VALIDATION_ERROR",
  "details": [ ... ],
  "message": "Invalid request. See details.",
  "information_link": "https://developer.paypal.com/docs/api/payments/#errors",
  "httpStatusCode": 400
}
```

### payment-execute

Endpoint executes a PayPal payment that the customer has approved.

#### Parameters

| name | type | description | example
| ---- | ---- | ----------- | -------
| payment_id | string | The ID of the payment to execute. | 
| payer_id | string | The ID of the payer that PayPal passes in the return_url. | 22393D847794YKER7MUI
| transactions | array | An array of transaction details. For execute the transactions object accepts only the amount object. | [   {     "amount": {       "currency": "USD",       "total": "1.00"     }   } ] 



#### Response

mimetype: `application/json`

##### Success `200`

```
{
  "id": "PAY-9N9834337A9191208KOZOQWI",
  "create_time": "2017-07-01T16:56:57Z",
  "update_time": "2017-07-01T17:05:41Z",
  "state": "approved",
  ...
}
```

##### Failed `400`

```
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "httpStatusCode": 404,
  ...
}
```

### Contributing

#### How to Contribute
  * Fork this repository
  * Clone from your fork
  * Make your contributions (Make sure your work is well tested)
  * Create Pull request from the fork to this repo

#### Setting up environment variables
  * Create a `.env` on parent folder
  * Copy contents of `.env-sample` file to newly created `.env` file and assign appropriate values to the listed variables.

#### Testing
  * Ensure all your test are written on the `test` directory
  * Use the command `npm test` to run test
