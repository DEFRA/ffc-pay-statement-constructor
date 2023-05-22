const { convertToPounds } = require('../../app/utility')

const {
  IMMEDIATE,
  QUARTERLY
} = require('../../app/constants/payment-type')

const {
  processingPaymentRequest,
  topUpProcessingPaymentRequest
} = require('./mock-payment-request')

module.exports = [{
  dueDate: '01/12/2022',
  order: 1,
  paymentType: QUARTERLY,
  period: 'Sep-Nov 2022',
  value: convertToPounds(processingPaymentRequest.value / 4)
},
{
  dueDate: '01/03/2023',
  order: 2,
  paymentType: QUARTERLY,
  period: 'Dec-Feb 2023',
  value: convertToPounds(processingPaymentRequest.value / 4)
},
{
  dueDate: undefined,
  order: 3,
  paymentType: IMMEDIATE,
  period: 'May 2023',
  value: convertToPounds(2 * (topUpProcessingPaymentRequest.value - processingPaymentRequest.value) / 4)
},
{
  dueDate: '01/06/2023',
  order: 4,
  paymentType: QUARTERLY,
  period: 'Mar-May 2023',
  value: convertToPounds(topUpProcessingPaymentRequest.value / 4)
},
{
  dueDate: '01/09/2023',
  order: 5,
  paymentType: QUARTERLY,
  period: 'Jun-Aug 2023',
  value: convertToPounds(topUpProcessingPaymentRequest.value / 4)
}]
