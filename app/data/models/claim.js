module.exports = (sequelize, DataTypes) => {
  const claim = sequelize.define('claim', {
    calculationId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    paymentRequestId: DataTypes.INTEGER,
    sbi: DataTypes.INTEGER,
    calculationDate: DataTypes.DATE,
    invoiceNumber: DataTypes.STRING
  },
  {
    tableName: 'claims',
    freezeTableName: true,
    timestamps: false
  })
  claim.associate = function (models) {
    claim.hasMany(models.scheme, {
      foreignKey: 'calculationId',
      as: 'schemes'
    })
    claim.belongsTo(models.paymentRequest, {
      foreignKey: 'paymentRequestId',
      as: 'paymentRequests'
    })
    claim.belongsTo(models.organisation, {
      foreignKey: 'sbi',
      as: 'organisations'
    })
    return claim
  }
}
