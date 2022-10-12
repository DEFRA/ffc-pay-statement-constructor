const db = require('../../data')
const { getDetails, getAddress, getDetailedFunding, getScheme, getDetailedPayments } = require('./components')
const getCalculation = require('../calculation')
const getPaymentRequest = require('../payment-request')
const { getSettlement, getLastSettlement } = require('../settlement')
const { getLatestPayment } = require('../payment')

const getStatement = async (settlementId) => {
  const transaction = await db.sequelize.transaction()
  try {
    const settlement = await getSettlement(settlementId, transaction)
    const paymentRequestId = settlement.paymentRequestId
    const paymentRequest = await getPaymentRequest(paymentRequestId, transaction)
    const calculation = await getCalculation(paymentRequest, transaction)
    const sbi = calculation.sbi
    const details = await getDetails(sbi, transaction)
    const address = await getAddress(sbi, transaction)
    const detailedFunding = await getDetailedFunding(calculation.calculationId, paymentRequestId, transaction)
    const scheme = await getScheme(paymentRequest)
    const lastSettlement = await getLastSettlement(settlement, transaction)
    const latestPayment = getLatestPayment(paymentRequest, settlement, lastSettlement)
    const payments = await getDetailedPayments(calculation, latestPayment, settlement, lastSettlement)

    await transaction.commit()
    return {
      ...details,
      address,
      funding: detailedFunding,
      payments,
      scheme
    }
  } catch (err) {
    await transaction.rollback()
    throw new Error(`Settlement with settlementId: ${settlementId} does not have the required data: ${err.message}`)
  }
}

module.exports = getStatement
