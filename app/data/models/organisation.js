module.exports = (sequelize, DataTypes) => {
  const organisation = sequelize.define('organisation', {
    sbi: { type: DataTypes.INTEGER, primaryKey: true },
    addressLine1: DataTypes.STRING,
    addressLine2: DataTypes.STRING,
    addressLine3: DataTypes.STRING,
    city: DataTypes.STRING,
    county: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    frn: DataTypes.BIGINT,
    name: DataTypes.STRING,
    postCode: DataTypes.STRING
  },
  {
    tableName: 'organisations',
    freezeTableName: true,
    timestamps: false
  })
  organisation.associate = function (models) {
    organisation.hasMany(models.claim, {
      foreignKey: 'sbi',
      as: 'claims'
    })
    return organisation
  }
}
