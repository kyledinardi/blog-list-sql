const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('reading_lists', 'read', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('reading_lists', 'read');
  },
};
