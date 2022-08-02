module.exports = (sequelize, DataTypes) => {
  const invoiceLine = sequelize.define('invoiceLine', {
    invoiceLineId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    paymentRequestId: DataTypes.INTEGER,
    schemeCode: DataTypes.STRING,
    accountCode: DataTypes.STRING,
    description: DataTypes.STRING,
    fundCode: DataTypes.STRING,
    value: DataTypes.INTEGER
  },
  {
    tableName: 'invoiceLines',
    freezeTableName: true,
    timestamps: false
  })
  invoiceLine.associate = function (models) {
    invoiceLine.belongsTo(models.paymentRequest, {
      foreignKey: 'paymentRequestId',
      as: 'paymentRequests'
    })
    invoiceLine.belongsTo(models.scheme, {
      foreignKey: 'schemeCode',
      as: 'schemes'
    })
  }
  return invoiceLine
}
