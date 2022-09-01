module.exports = (sequelize, DataTypes) => {
  const funding = sequelize.define('funding', {
    fundingId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    calculationId: DataTypes.INTEGER,
    fundingCode: DataTypes.STRING,
    areaClaimed: DataTypes.DECIMAL
  },
  {
    tableName: 'fundings',
    freezeTableName: true,
    timestamps: false
  })
  funding.associate = function (models) {
    funding.belongsTo(models.calculation, {
      foreignKey: 'calculationId',
      as: 'calculations'
    })
    funding.belongsTo(models.fundingOption, {
      foreignKey: 'fundingCode',
      as: 'fundingOptions'
    })
  }
  return funding
}
