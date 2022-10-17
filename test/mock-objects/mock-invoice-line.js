const fundingCode = require('../../app/constants/funding-codes')
const FundingCodeName = require('../../app/constants/funding-code-names')

const mappedFundingsData = [
  {
    area: 5,
    level: 'braid',
    name: 'local',
    rate: 28.55
  },
  {
    area: 6,
    level: '',
    name: 'my test now',
    rate: 38.55
  },
  {
    area: 9,
    level: '',
    name: 'last row',
    rate: 48.55
  }
]

const rawFundingOptions = [
  {
    fundingCode: fundingCode.ARABLE_SOIL_INTRODUCTORY,
    name: FundingCodeName.ARABLE_SOIL_INTRODUCTORY
  },
  {
    fundingCode: fundingCode.ARABLE_SOIL_INTERMEDIATE,
    name: FundingCodeName.ARABLE_SOIL_INTERMEDIATE
  }
]

const rawInvoiceLines = [
  {
    fundingCode: fundingCode.ARABLE_SOIL_INTRODUCTORY,
    paymentRequestId: 1,
    value: 500
  },
  {
    fundingCode: fundingCode.ARABLE_SOIL_INTERMEDIATE,
    paymentRequestId: 2,
    value: 600
  },
  {
    fundingCode: fundingCode.ARABLE_SOIL_INTERMEDIATE,
    paymentRequestId: 1,
    value: 800
  },
  {
    fundingCode: fundingCode.ARABLE_SOIL_INTRODUCTORY,
    paymentRequestId: 1,
    value: -100,
    description: 'P02 - Over declaration reduction'
  }
]

module.exports = {
  rawFundingOptions,
  mappedFundingsData,
  rawInvoiceLines
}
