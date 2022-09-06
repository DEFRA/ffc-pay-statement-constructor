const mapFundings = async (rawFundings) => {
  const fundings = rawFundings.map(rawFunding => ({
    area: rawFunding.areaClaimed,
    rate: rawFunding.rate,
    name: getName(rawFunding['fundingOptions.name']),
    level: getLevel(rawFunding['fundingOptions.name'])
  }))

  return fundings
}

const getName = (rawName) => {
  const nameLevel = rawName.split(':')
  return nameLevel[0].trim()
}

const getLevel = (rawName) => {
  const nameLevel = rawName.split(':')
  return nameLevel[1] ? nameLevel[1].trim() : ''
}

module.exports = mapFundings
