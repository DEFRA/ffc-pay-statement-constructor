<<<<<<< HEAD
const processSubmitPaymentRequest = require('./process-submit-payment-request')
const processReturnSettlement = require('./process-return-settlement')

module.exports = {
  processSubmitPaymentRequest,
  processReturnSettlement
=======
const processProcessingPaymentRequest = require('./processing/process-processing-payment-request')
const processSubmitPaymentRequest = require('./submit/process-submit-payment-request')

module.exports = {
  processProcessingPaymentRequest,
  processSubmitPaymentRequest
>>>>>>> 6cf9c6aba539539c629d6bf97dbfb326575f5d5f
}
