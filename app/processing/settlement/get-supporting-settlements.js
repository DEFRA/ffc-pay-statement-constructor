const getCompletedInvoiceNumbers = require('./get-completed-invoice-numbers')
const getSettlementsByInvoiceNumber = require('./get-settlements-by-invoice-number')

const getSupportingSettlements = async (settlementDate, agreementNumber, marketingYear, transaction) => {
  const completedInvoiceNumbers = await getCompletedInvoiceNumbers(agreementNumber, marketingYear, transaction)
  const supportingSettlements = await getSettlementsByInvoiceNumber(settlementDate, completedInvoiceNumbers, transaction)
  return supportingSettlements
}

module.exports = getSupportingSettlements
