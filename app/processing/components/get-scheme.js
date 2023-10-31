const { LONG_NAMES, SHORT_NAMES } = require('../../constants/scheme-names')
const getAgreementNumberByClaimId = require('../agreementNumber/get-agreement-number-by-claim-id')

const getScheme = async (year, frequency, agreementNumber, sourceSystem) => {
  const docAgreementNumber = sourceSystem === SHORT_NAMES.SFIA ? await getAgreementNumberByClaimId(agreementNumber).agreementNumber : agreementNumber

  return {
    name: LONG_NAMES[sourceSystem],
    shortName: sourceSystem,
    year: String(year),
    frequency,
    agreementNumber: docAgreementNumber
  }
}

module.exports = getScheme
