const { getDetails, getAdress, getDetailedFunding, getScheme, getDetailedPayments } = require('./components')
const getCalculation = require('../calculation')
const getPaymentRequest = require('../payment-request')
const getSettlement = require('../settlement')

const getStatement = async (settlementId) => {
  const settlement = await getSettlement(settlementId)
  const paymentRequestId = settlement.paymentRequestId
  const paymentRequest = await getPaymentRequest(paymentRequestId)
  const calculation = await getCalculation(paymentRequestId)
  const details = await getDetails(calculation.sbi)
  const address = await getAdress(calculation.sbi)
  const detailedFunding = await getDetailedFunding(calculation.calculationId)
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
