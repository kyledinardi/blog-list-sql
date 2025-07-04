const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      token: { type: DataTypes.STRING, allowNull: false, unique: true },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions');
  },
};
