const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('blogs', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING },
      url: { type: DataTypes.STRING, allowNull: false },
      likes: { type: DataTypes.INTEGER, defaultValue: 0 },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    });

    await queryInterface.createTable('users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      password_hash: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
    });

    await queryInterface.addColumn('blogs', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('blogs');
    await queryInterface.dropTable('users');
  },
};
