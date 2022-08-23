const processOrganisation = require('../organisation/process-organisation')

const processStatementData = async (statementData) => {
  const organisation = statementData

  await processOrganisation(organisation)
}

module.exports = processStatementData
