const dummy = () => 1;
const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  return blogs.find((blog) => blog.likes === maxLikes);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const authors = blogs.map((blog) => blog.author);

  const authorCounts = authors.reduce((acc, author) => {
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  const maxBlogs = Math.max(...Object.values(authorCounts));

  const authorWithMostBlogs = Object.keys(authorCounts).find(
    (author) => authorCounts[author] === maxBlogs,
  );

  return {
    author: authorWithMostBlogs,
    blogs: maxBlogs,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const authorLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  const maxLikes = Math.max(...Object.values(authorLikes));

  const authorWithMostLikes = Object.keys(authorLikes).find(
    (author) => authorLikes[author] === maxLikes,
  );

  return {
    author: authorWithMostLikes,
    likes: maxLikes,
  };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
