const db = require('../data')

const saveInvoiceLines = async (invoiceLines, paymentRequestId, transaction) => {
  for (const invoiceLine of invoiceLines) {
    delete invoiceLine.invoiceLineId
    invoiceLine.fundingCode = invoiceLine.schemeCode
    try {
      await db.invoiceLine.create({ ...invoiceLine, paymentRequestId }, { transaction })
    } catch (err) {
      // console.error(err)
    }
  }
}

module.exports = saveInvoiceLines
