const db = require('../../data')

const savePlaceholderOrganisation = require('./save-placeholder-organisation')
const getCalculationBySbi = require('./get-calculation-by-sbi')
const saveCalculation = require('./save-calculation')
const saveFundings = require('./save-fundings')
const updateCalculation = require('./update-calculation')

const processCalculation = async (calculation) => {
  const transaction = await db.sequelize.transaction()

  try {
    const existingCalculation = await getCalculationBySbi(calculation.sbi, transaction)
    if (existingCalculation) {
      console.info(`Duplicate calculation received, skipping ${existingCalculation.sbi}`)
      await transaction.rollback()
    } else {
      await savePlaceholderOrganisation({ sbi: calculation.sbi }, calculation.sbi)
      const savedCalculation = await saveCalculation(calculation, transaction)
      await saveFundings(calculation.fundings, savedCalculation.calculationId, transaction)
      await updateCalculation(calculation.invoiceNumber, savedCalculation.calculationId, transaction)
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = processCalculation
