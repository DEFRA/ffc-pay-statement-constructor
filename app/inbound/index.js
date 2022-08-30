const processProcessingPaymentRequest = require('./processing/process-processing-payment-request')
const processSubmitPaymentRequest = require('./submit/process-submit-payment-request')
const processReturnSettlement = require('./process-return-settlement')

module.exports = {
  processProcessingPaymentRequest,
  processSubmitPaymentRequest,
  processReturnSettlement
}
