const getFundings = require('../../funding')
const getInvoiceLine = require('../../invoice-line')
const { convertToPounds } = require('../../../utility')

const getDetailedFunding = async (calculationId, paymentRequestId) => {
  const fundings = await getFundings(calculationId)
  const detailedFundings = []

  for (const funding of fundings) {
    const invoiceLine = await getInvoiceLine(funding.fundingCode, paymentRequestId)
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
