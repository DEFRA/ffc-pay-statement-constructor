const getScheme = async (paymentRequest) => {
  return {
    name: 'Sustainable Farming Incentive',
    shortName: 'SFI',
    year: String(paymentRequest.year),
    frequency: paymentRequest.frequency,
    agreementNumber: paymentRequest.agreementNumber
  }
}

module.exports = getScheme
