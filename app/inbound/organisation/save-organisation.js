const db = require('../../data')

const saveOrganisation = async (organisation, transaction) => {
  try {
    await db.organisation.create(organisation, { transaction })
  } catch (err) { console.error(err) }
}

module.exports = saveOrganisation
