const settlement = require('../../data/models/settlement')
const getCompletedInvoiceNumbers = require('./get-completed-invoice-numbers')
const getLastSettlement = require('./get-last-settlement')
const getSettlementsByInvoiceNumber = require('./get-settlements-by-invoice-number')
const validateSupportingSettlements = require('./validate-supporting-settlements')

const getSupportingSettlements = async (settlementDate, agreementNumber, marketingYear, transaction) => {
  const completedInvoiceNumbers = await getCompletedInvoiceNumbers(agreementNumber, marketingYear, transaction)
  const supportingSettlements = await getSettlementsByInvoiceNumber(settlementDate, completedInvoiceNumbers, transaction)
  validateSupportingSettlements(completedInvoiceNumbers, supportingSettlements)
  for (const supportingSettlement of supportingSettlements) {
    const lastSettlement = await getLastSettlement(supportingSettlement.settlementDate, supportingSettlement.value, supportingSettlement.invoiceNumber, transaction)
    const lastSettlementValue = lastSettlement?.value ?? 0
    settlement.value = settlement.value - lastSettlementValue
  }
  return supportingSettlements
}

module.exports = getSupportingSettlements
