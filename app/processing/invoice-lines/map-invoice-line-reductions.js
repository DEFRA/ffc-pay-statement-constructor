const mapInvoiceLineReductions = (invoiceLineGroup) => {
  const mappedReductions = invoiceLineGroup.filter(invoiceLine => invoiceLine.description === 'Over declaration reduction').map(reduction => {
    const reductions = {
      reason: reduction.description,
      value: reduction.value
    }
    return reductions
  })
  return mappedReductions
}

module.exports = mapInvoiceLineReductions
