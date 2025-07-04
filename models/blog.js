const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class Blog extends Model {}

Blog.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING, allowNull: false },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },

    year: {
      type: DataTypes.INTEGER,
      validate: { min: 1991, max: new Date().getFullYear() },
    },
  },

  { sequelize, underscored: true, modelName: 'blog' }
);

module.exports = Blog;
