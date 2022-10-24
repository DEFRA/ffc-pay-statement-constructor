const mockCommit = jest.fn()
const mockRollback = jest.fn()
const mockTransaction = {
  commit: mockCommit,
  rollback: mockRollback
}

jest.mock('../../../../app/data', () => {
  return {
    sequelize:
       {
         transaction: jest.fn().mockImplementation(() => {
           return { ...mockTransaction }
         })
       }
  }
})

const db = require('../../../../app/data')
const getOrganisation = require('../../../../app/processing/organisation')

let organisationData
let retrievedOrganisationData
let sbi

describe('process get calculation object', () => {
  beforeAll(async () => {
    await db.sequelize.truncate({
      cascade: true,
      restartIdentity: true
    })
  })

  beforeEach(async () => {
    organisationData = JSON.parse(JSON.stringify(require('../../../mock-objects/mock-organisation')))
    retrievedOrganisationData = {
      addressLine1: organisationData.line1,
      addressLine2: organisationData.line2,
      addressLine3: organisationData.line3,
      city: organisationData.line4,
      county: organisationData.line5,
      postcode: organisationData.postcode,
      name: organisationData.businessName,
      emailAddress: organisationData.email,
      frn: organisationData.frn,
      sbi: organisationData.sbi
    }
    sbi = organisationData.sbi
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

  test('should throw error when no existing organisation data', async () => {
    const wrapper = async () => { await getOrganisation(sbi, mockTransaction) }

    expect(wrapper).rejects.toThrow()
  })

  test('should not throw error when there is existing organisation data with sbi, and other valid data', async () => {
    await db.organisation.create(retrievedOrganisationData)

    const result = await getOrganisation(sbi, mockTransaction)

    expect(result).toStrictEqual({
      line1: retrievedOrganisationData.addressLine1,
      line2: retrievedOrganisationData.addressLine2,
      line3: retrievedOrganisationData.addressLine3,
      line4: retrievedOrganisationData.city,
      line5: retrievedOrganisationData.county,
      postcode: retrievedOrganisationData.postcode,
      businessName: retrievedOrganisationData.name,
      email: retrievedOrganisationData.emailAddress,
      frn: retrievedOrganisationData.frn,
      sbi: retrievedOrganisationData.sbi
    })
  })

  test('should throw error when there is existing organisation data with sbi but no frn', async () => {
    retrievedOrganisationData.frn = null
    await db.organisation.create(retrievedOrganisationData)

    const wrapper = async () => { await getOrganisation(sbi, mockTransaction) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw error when there is existing organisation data with sbi but no postcode', async () => {
    retrievedOrganisationData.postcode = null
    await db.organisation.create(retrievedOrganisationData)

    const wrapper = async () => { await getOrganisation(sbi, mockTransaction) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw error when there is existing organisation data with sbi but sbi less than 105000000', async () => {
    retrievedOrganisationData.sbi = 10500000
    await db.organisation.create(retrievedOrganisationData)

    const wrapper = async () => { await getOrganisation(retrievedOrganisationData.sbi, mockTransaction) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw error when there is existing organisation data with sbi but sbi greater than 999999999', async () => {
    retrievedOrganisationData.sbi = 9999999990
    await db.organisation.create(retrievedOrganisationData)

    const wrapper = async () => { await getOrganisation(retrievedOrganisationData.sbi, mockTransaction) }

    expect(wrapper).rejects.toThrow()
  })

  test('should throw error when there is data in organisation table but no corresponding record with provided sbi', async () => {
    await db.organisation.create(retrievedOrganisationData)
    sbi = 124534678
    const wrapper = async () => { await getOrganisation(sbi, mockTransaction) }

    expect(wrapper).rejects.toThrow()
  })
})
