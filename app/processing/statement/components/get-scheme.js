const getScheme = async (paymentRequest) => {
  return {
    name: 'Sustainable Farming Incentive',
    shortName: 'SFI',
    year: paymentRequest.year,
    frequency: paymentRequest.frequency,
    agreementNumber: paymentRequest.agreementNumber
  }
}

module.exports = getScheme
