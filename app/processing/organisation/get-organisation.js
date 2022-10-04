const schema = require('./organisation-schema')
const getOrganisationBySbi = require('./get-organisation-by-sbi')

const getOrganisation = async (sbi, transaction) => {
  const organisation = await getOrganisationBySbi(sbi, transaction)

  const result = schema.validate(organisation, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`Organisation with the sbi: ${sbi} does not have the required details data: ${result.error.message}`)
  }

  return {
    line1: organisation.addressLine1,
    line2: organisation.addressLine2,
    line3: organisation.addressLine3,
    line4: organisation.city,
    line5: organisation.county,
    postcode: organisation.postcode,
    businessName: organisation.name,
    email: organisation.emailAddress,
    frn: organisation.frn,
    sbi: organisation.sbi
  }
}

module.exports = getOrganisation
