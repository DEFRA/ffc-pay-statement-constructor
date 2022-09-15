const { getDetails, getAddress, getDetailedFunding, getScheme, getDetailedPayments } = require('./components')
const getCalculation = require('../calculation')
const getPaymentRequest = require('../payment-request')
const getSettlement = require('../settlement')

const getStatement = async (settlementId, transaction) => {
  const settlement = await getSettlement(settlementId, transaction)
  const paymentRequestId = settlement.paymentRequestId
  const paymentRequest = await getPaymentRequest(paymentRequestId, transaction)
  const calculation = await getCalculation(paymentRequestId, transaction)
  const details = await getDetails(calculation.sbi, transaction)
  const address = await getAddress(calculation.sbi, transaction)
  const detailedFunding = await getDetailedFunding(calculation.calculationId, transaction)
  const scheme = await getScheme(paymentRequest)
  const payments = await getDetailedPayments(calculation, paymentRequest, settlement)

  return {
    ...details,
    address,
    funding: detailedFunding,
    payments,
    scheme
  }
}

module.exports = getStatement
