const db = require('../../data')

const saveOrganisation = async (organisation, transaction) => {
  await db.organisation.create(organisation, { transaction })
}

module.exports = saveOrganisation
