module.exports = (sequelize, DataTypes) => {
  const funding = sequelize.define('funding', {
    fundingCode: { type: DataTypes.STRING, primaryKey: true },
    calculationId: DataTypes.INTEGER,
    areaClaimed: DataTypes.DECIMAL
  },
  {
    tableName: 'fundings',
    freezeTableName: true,
    timestamps: false
  })
  funding.associate = function (models) {
    funding.hasMany(models.invoiceLine, {
      foreignKey: 'fundingCode',
      as: 'invoiceLines'
    })
    funding.belongsTo(models.claim, {
      foreignKey: 'calculationId',
      as: 'claims'
    })
  }
  return funding
}
