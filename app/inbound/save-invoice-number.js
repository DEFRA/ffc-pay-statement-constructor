const db = require('../data')
const reverseEngineerInvoiceNumber = require('../processing/reverse-engineer-invoice-number')

const saveInvoiceNumber = async (invoiceNumber, transaction) => {
  await db.invoiceNumber.findOrCreate({
    where: { invoiceNumber },
    defaults: { originalInvoiceNumber: reverseEngineerInvoiceNumber(invoiceNumber) },
    transaction
  })
}

module.exports = saveInvoiceNumber
