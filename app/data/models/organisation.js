module.exports = (sequelize, DataTypes) => {
  const organisation = sequelize.define('organisation', {
    sbi: { type: DataTypes.INTEGER, primaryKey: true },
    address: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    frn: DataTypes.BIGINT,
    name: DataTypes.STRING
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
