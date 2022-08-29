const processOrganisation = require('../organisation/process-organisation')
const processCalculation = require('../calculation/process-calculation')

const processStatementData = async (statementData) => {
  const organisation = statementData

  await processOrganisation(organisation)

  const calculation = statementData

  await processCalculation(calculation)
}

module.exports = processStatementData
