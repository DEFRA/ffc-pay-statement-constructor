const getFundingName = (name) => {
  return name.split(':')[0]?.trim() ?? ''
}

module.exports = getFundingName
