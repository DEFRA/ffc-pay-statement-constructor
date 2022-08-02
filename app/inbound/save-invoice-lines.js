const db = require('../data')

const saveInvoiceLines = async (invoiceLines, paymentRequestId, transaction) => {
  for (const invoiceLine of invoiceLines) {
    delete invoiceLine.invoiceLineId
    invoiceLine.fundingCode = invoiceLine.schemeCode
    delete invoiceLine.schemeCode
    await db.invoiceLine.create({ paymentRequestId, ...invoiceLine }, { transaction })
  }
}

module.exports = saveInvoiceLines
