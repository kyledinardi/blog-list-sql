const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const testBlogs = require('./testBlogs');

test('dummy returns one', () => assert.strictEqual(listHelper.dummy([]), 1));

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () =>
    assert.strictEqual(listHelper.totalLikes([testBlogs[0]]), 7));

  test('of an empty list is zero', () =>
    assert.strictEqual(listHelper.totalLikes([]), 0));

  test('of a bigger list is calculated right', () =>
    assert.strictEqual(listHelper.totalLikes(testBlogs), 36));
});

describe('favorite blog', () => {
  test('when list has only one blog, equals that', () =>
    assert.deepStrictEqual(
      listHelper.favoriteBlog([testBlogs[0]]),
      testBlogs[0],
    ));

  test('of an empty list is undefined', () =>
    assert.deepStrictEqual(listHelper.favoriteBlog([]), undefined));

  test('of a bigger list is the one with most likes', () =>
    assert.deepStrictEqual(listHelper.favoriteBlog(testBlogs), testBlogs[2]));
});

describe('most blogs', () => {
  test('when list has only one blog, equals the author of that', () => {
    const expected = { author: 'Michael Chan', blogs: 1 };
    assert.deepStrictEqual(listHelper.mostBlogs([testBlogs[0]]), expected);
  });

  test('of an empty list is undefined', () =>
    assert.deepStrictEqual(listHelper.mostBlogs([]), undefined));

  test('of a bigger list is the author with most blogs', () => {
    const expected = { author: 'Robert C. Martin', blogs: 3 };
    assert.deepStrictEqual(listHelper.mostBlogs(testBlogs), expected);
  });
});

describe('most likes', () => {
  test('when list has only one blog, equals the author of that', () => {
    const expected = { author: 'Michael Chan', likes: 7 };
    assert.deepStrictEqual(listHelper.mostLikes([testBlogs[0]]), expected);
  });

  test('of an empty list is undefined', () =>
    assert.deepStrictEqual(listHelper.mostLikes([]), undefined));

  test('of a bigger list is the author with most likes', () => {
    const expected = { author: 'Edsger W. Dijkstra', likes: 17 };
    assert.deepStrictEqual(listHelper.mostLikes(testBlogs), expected);
  });
});
