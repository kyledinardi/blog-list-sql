const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class Session extends Model {}

Session.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: DataTypes.STRING, allowNull: false, unique: true },
  },

  { sequelize, underscored: true, timestamps: false, modelName: 'session' }
);

module.exports = Session;
