const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./readingList');
const Session = require('./session');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingList, as: 'readers' });
Blog.hasMany(ReadingList);
ReadingList.belongsTo(Blog);
module.exports = { Blog, User, ReadingList, Session };
