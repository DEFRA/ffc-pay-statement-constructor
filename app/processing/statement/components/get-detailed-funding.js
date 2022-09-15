const getFundings = require('../../funding')
const getPositiveInvoiceLine = require('../../invoice-line')
const { convertToPounds } = require('../../../utility')

const getDetailedFunding = async (calculationId, paymentRequestId, transaction) => {
  const fundings = await getFundings(calculationId, transaction)
  const detailedFundings = []

  for (const funding of fundings) {
    const invoiceLine = await getPositiveInvoiceLine(funding.fundingCode, paymentRequestId, transaction)
    const { annualValue, quarterlyValue, quarterlyReduction, quarterlyPayment, reductions } = invoiceLine

    const invoiceLineInPounds = {
      annualValue: convertToPounds(annualValue),
      quarterlyValue: convertToPounds(quarterlyValue),
      quarterlyReduction: convertToPounds(quarterlyReduction),
      quarterlyPayment: convertToPounds(quarterlyPayment),
      reductions
    }

    const detailedFunding = { ...funding, ...invoiceLineInPounds }
    detailedFundings.push(detailedFunding)
  }

  return detailedFundings
}

module.exports = getDetailedFunding
