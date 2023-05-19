const getFundingLevel = (name) => {
  return name.split(':')[1]?.trim() ?? ''
}

module.exports = getFundingLevel
