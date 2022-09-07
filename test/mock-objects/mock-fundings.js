
const ARABLE_SOIL_INTRODUCTORY = require('../../app/constants/funding-codes')

const rawFundingsData = [
  {
    calculationId: 1,
    fundingCode: ARABLE_SOIL_INTRODUCTORY.ARABLE_SOIL_INTRODUCTORY,
    areaClaimed: 5.00,
    rate: 28.55,
    fundingOptions: { name: 'TestLand : UpperLevel' }
  },
  {
    calculationId: 1,
    fundingCode: ARABLE_SOIL_INTRODUCTORY.ARABLE_SOIL_INTRODUCTORY,
    areaClaimed: 6.00,
    rate: 38.55,
    fundingOptions: { name: 'Free Arable Land' }
  },
  {
    calculationId: 1,
    fundingCode: ARABLE_SOIL_INTRODUCTORY.ARABLE_SOIL_INTRODUCTORY,
    areaClaimed: 9.00,
    rate: 48.55,
    fundingOptions: { name: 'Free New Land' }
  }
]

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

module.exports = {
  rawFundingsData,
  mappedFundingsData
}
