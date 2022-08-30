const db = require('../../data')

const getOrganisationBySbi = require('./get-organisation-by-sbi')
const saveOrganisation = require('./save-organisation')

const processOrganisation = async (organisation) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingOrganisation = await getOrganisationBySbi(organisation.sbi, transaction)
    if (existingOrganisation) {
      console.info(`Duplicate organisation received, skipping ${existingOrganisation.sbi}`)
      await transaction.rollback()
    } else {
      await saveOrganisation(organisation, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processOrganisation
