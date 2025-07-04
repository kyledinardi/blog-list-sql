require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);

const main = async () => {
  try {
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    });

    sequelize.close();

    blogs.forEach((blog) => {
      const { author, title, likes } = blog;

      console.log(
        `${author}: '${title}', ${likes} like${likes === 1 ? '' : 's'}'`
      );
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();
