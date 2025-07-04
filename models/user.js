const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    disabled: { type: DataTypes.BOOLEAN, defaultValue: false },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
  },

  { sequelize, underscored: true, modelName: 'user' }
);

module.exports = User;
