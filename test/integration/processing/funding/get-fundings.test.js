const db = require('../../../../app/data')
const schemes = require('../../../../app/constants/schemes')
const { SFI_FIRST_PAYMENT: SFI_FIRST_PAYMENT_INVOICE_NUMBER } = require('../../../mock-components/mock-invoice-number')

const getFundings = require('../../../../app/processing/funding/get-fundings')

let rawFundingsData

describe('get and transform fundings object for building a statement object', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    rawFundingsData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-fundings').rawFundingsData))
    const rawCalculationData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-calculation')))
    await db.scheme.bulkCreate(schemes)
    await db.organisation.create({ sbi: rawCalculationData.sbi })
    await db.invoiceNumber.create({ invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER })
    await db.paymentRequest.create({
      paymentRequestId: 1,
      schemeId: 1,
      invoiceNumber: SFI_FIRST_PAYMENT_INVOICE_NUMBER
    })
    await db.calculation.create(rawCalculationData)
  })

  afterEach(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  test('should return list of all matching record when called with calculationId and all matching records are valid', async () => {
    const calculationId = 1
    await db.fundingOption.create({ fundingCode: rawFundingsData[0].fundingCode, name: 'Name Test' })
    await db.funding.bulkCreate(rawFundingsData)
    const fundings = await getFundings(calculationId)
    expect(fundings.length).toBe(rawFundingsData.length)
  })

  test('should return error if there is no matching record when called with calculationId', async () => {
    const calculationId = 2
    await db.fundingOption.create({ fundingCode: rawFundingsData[0].fundingCode, name: 'Name Test' })
    await db.funding.bulkCreate(rawFundingsData)
    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return error if there is a record with invalid areaClaimed when called with calculationId', async () => {
    const calculationId = 1
    await db.fundingOption.create({ fundingCode: rawFundingsData[0].fundingCode, name: 'Name Test' })
    rawFundingsData[1].areaClaimed = null
    await db.funding.bulkCreate(rawFundingsData)
    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return error if there is a record with invalid rate  when called with calculationId', async () => {
    const calculationId = 1
    await db.fundingOption.create({ fundingCode: rawFundingsData[0].fundingCode, name: 'Name Test' })
    rawFundingsData[1].rate = null
    await db.funding.bulkCreate(rawFundingsData)
    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return valid when called with calculationId and a returned record has null rate but with name equal Moorland: Additional', async () => {
    const calculationId = 1
    await db.fundingOption.create({ fundingCode: rawFundingsData[0].fundingCode, name: 'Moorland: Additional' })
    rawFundingsData[1].rate = null
    await db.funding.bulkCreate(rawFundingsData)
    const fundings = await getFundings(calculationId)
    expect(fundings.length).toBe(rawFundingsData.length)
  })

  test('should return valid when called with calculationId and a returned record has null rate and null areaClaimed but with name equal Moorland: Additional', async () => {
    const calculationId = 1
    await db.fundingOption.create({ fundingCode: rawFundingsData[0].fundingCode, name: 'Moorland: Additional' })
    rawFundingsData[1].rate = null
    rawFundingsData[1].areaClaimed = null
    await db.funding.bulkCreate(rawFundingsData)
    const fundings = await getFundings(calculationId)
    expect(fundings.length).toBe(rawFundingsData.length)
  })

  test('should return invalid when called with calculationId and a returned record has null rate but with name equal Moorland: Intermediary', async () => {
    const calculationId = 1
    await db.fundingOption.create({ fundingCode: rawFundingsData[0].fundingCode, name: 'Moorland: Intermediary' })
    rawFundingsData[1].rate = null
    await db.funding.bulkCreate(rawFundingsData)
    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return invalid when called with calculationId and a returned record has null rate but with name equal  Common land: Additional', async () => {
    const calculationId = 1
    await db.fundingOption.create({ fundingCode: rawFundingsData[0].fundingCode, name: 'Common land: Additional' })
    rawFundingsData[1].rate = null
    await db.funding.bulkCreate(rawFundingsData)
    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return valid when called with calculationId and a returned record has null areaClaimed but with name equal Moorland: Additional', async () => {
    const calculationId = 1
    await db.fundingOption.create({ fundingCode: rawFundingsData[0].fundingCode, name: 'Moorland: Additional' })
    rawFundingsData[1].areaClaimed = null
    await db.funding.bulkCreate(rawFundingsData)
    const fundings = await getFundings(calculationId)
    expect(fundings.length).toBe(rawFundingsData.length)
  })

  test('should return invalid when called with calculationId and a returned record has null areaClaimed but with name equal Moorland: Intermediary', async () => {
    const calculationId = 1
    await db.fundingOption.create({ fundingCode: rawFundingsData[0].fundingCode, name: 'Moorland: Intermediary' })
    rawFundingsData[1].areaClaimed = null
    await db.funding.bulkCreate(rawFundingsData)
    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })

  test('should return invalid when called with calculationId and a returned record has null areaClaimed but with name equal  Common land: Additional', async () => {
    const calculationId = 1
    await db.fundingOption.create({ fundingCode: rawFundingsData[0].fundingCode, name: 'Common land: Additional' })
    rawFundingsData[1].areaClaimed = null
    await db.funding.bulkCreate(rawFundingsData)
    const wrapper = async () => {
      await getFundings(calculationId)
    }

    expect(wrapper).rejects.toThrow(Error)
  })
})
