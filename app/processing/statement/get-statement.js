const db = require('../../data')
const { getDetails, getAddress, getDetailedFunding, getScheme, getDetailedPayments } = require('./components')
const getCalculation = require('../calculation')
const getPaymentRequest = require('../payment-request')
const { getSettlement, getLastSettlement, getSupportingSettlements } = require('../settlement')
const { getLatestPayment } = require('../payment')

const getStatement = async (settlementId) => {
  const transaction = await db.sequelize.transaction()
  try {
    const settlement = await getSettlement(settlementId, transaction)
    const paymentRequest = await getPaymentRequest(settlement.paymentRequestId, transaction)
    const calculation = await getCalculation(paymentRequest.paymentRequestId, paymentRequest.invoiceNumber, transaction)
    const sbi = calculation.sbi
    const details = await getDetails(sbi, transaction)
    const address = await getAddress(sbi, transaction)
    const funding = await getDetailedFunding(calculation.calculationId, paymentRequest.paymentRequestId, transaction)
    const scheme = getScheme(paymentRequest.year, paymentRequest.frequency, paymentRequest.agreementNumber)
    const lastSettlement = await getLastSettlement(settlement.settlementDate, settlement.value, settlement.invoiceNumber, transaction)
    const supportingSettlements = await getSupportingSettlements(settlement.settlementDate, paymentRequest.agreementNumber, paymentRequest.year, transaction)
    const latestPayment = getLatestPayment(paymentRequest, settlement, lastSettlement, supportingSettlements)
    const payments = getDetailedPayments(calculation, latestPayment, settlement)

    await transaction.commit()
    return {
      ...details,
      address,
      funding,
      payments,
      scheme
    }
  } catch (err) {
    await transaction.rollback()
    throw new Error(`Settlement with settlementId: ${settlementId} does not have the required data: ${err.message}`)
  }
}

module.exports = getStatement
