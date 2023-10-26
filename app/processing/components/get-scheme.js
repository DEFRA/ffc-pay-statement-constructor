const { LONG_NAMES } = require('../../constants/scheme-names')

const getScheme = (year, frequency, agreementNumber, sourceSystem) => {
  return {
    name: LONG_NAMES[sourceSystem],
    shortName: sourceSystem,
    year: String(year),
    frequency,
    agreementNumber
  }
}

module.exports = getScheme
