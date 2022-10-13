const getFundings = require('../../funding')
const getInvoiceLine = require('../../invoice-line')
const { convertToPounds } = require('../../../utility')

const getDetailedFunding = async (calculationId, paymentRequestId, transaction) => {
  const fundings = await getFundings(calculationId, transaction)
  const detailedFundings = []

  for (const funding of fundings) {
    const invoiceLine = await getInvoiceLine(funding.fundingCode, paymentRequestId, transaction)
    const { annualValue, quarterlyValue, quarterlyReduction, quarterlyPayment, reductions } = invoiceLine

    const invoiceLineInPounds = {
      annualValue: convertToPounds(annualValue),
      quarterlyValue: convertToPounds(quarterlyValue),
      quarterlyReduction: convertToPounds(quarterlyReduction),
      quarterlyPayment: convertToPounds(quarterlyPayment),
      reductions
    }

    const detailedFunding = {
      area: funding.area,
      level: funding.level,
      name: funding.name,
      rate: funding.rate,
      ...invoiceLineInPounds
    }

    detailedFundings.push(detailedFunding)
  }

  const total = {
    area: detailedFundings.reduce((x, y) => x + Number(y.area), 0).toFixed(4),
    level: '',
    name: 'Total',
    rate: '',
    annualValue: detailedFundings.reduce((x, y) => x + Number(y.annualValue), 0).toFixed(2),
    quarterlyValue: detailedFundings.reduce((x, y) => x + Number(y.quarterlyValue), 0).toFixed(2),
    quarterlyReduction: detailedFundings.reduce((x, y) => x + Number(y.quarterlyReduction), 0).toFixed(2),
    quarterlyPayment: detailedFundings.reduce((x, y) => x + Number(y.quarterlyPayment), 0).toFixed(2)
  }

  detailedFundings.push(total)

  return detailedFundings
}

module.exports = getDetailedFunding
