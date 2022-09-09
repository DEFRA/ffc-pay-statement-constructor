const getOrganisation = require('../../organisation')

const getDetails = async (sbi) => {
  const organisation = await getOrganisation(sbi)
  return {
    businessName: organisation.businessName,
    email: organisation.email,
    frn: organisation.frn,
    sbi: organisation.sbi
  }
}

module.exports = getDetails
