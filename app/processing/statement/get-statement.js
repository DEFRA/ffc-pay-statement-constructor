const { getDetails, getAddress, getDetailedFunding, getScheme, getDetailedPayments } = require('./components')
const getCalculation = require('../calculation')
const getPaymentRequest = require('../payment-request')
const getSettlement = require('../settlement')

const getStatement = async (settlementId, transaction) => {
  try {
    const settlement = await getSettlement(settlementId, transaction)
    const paymentRequestId = settlement.paymentRequestId
    const paymentRequest = await getPaymentRequest(paymentRequestId, transaction)
    const calculation = await getCalculation(paymentRequestId, transaction)
    const sbi = calculation.sbi
    const details = await getDetails(sbi, transaction)
    const address = await getAddress(sbi, transaction)
    const detailedFunding = await getDetailedFunding(calculation.calculationId, paymentRequestId, transaction)
    const scheme = await getScheme(paymentRequest)
    const payments = await getDetailedPayments(calculation, paymentRequest, settlement)

    return {
      ...details,
      address,
      funding: detailedFunding,
      payments,
      scheme
    }
  } catch (err) {
    throw new Error(`Settlement with settlementId: ${settlementId} does not have the required data: ${err.message}`)
  }
}

module.exports = getStatement
