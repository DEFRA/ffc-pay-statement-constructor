const getFundings = require('../../funding')
const getInvoiceLine = require('../../invoice-line')

const getDetailedFunding = async (calculationId, paymentRequestId) => {
  const fundings = await getFundings(calculationId)
  const detailedFundings = []

  for (const funding of fundings) {
    const invoiceLine = await getInvoiceLine(funding.fundingCode, paymentRequestId)
    const detailedFunding = { ...funding, ...invoiceLine }
    detailedFundings.push(detailedFunding)
  }

  return detailedFundings
}

module.exports = getDetailedFunding
