const { test, beforeEach, after, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const testBlogs = require('./testBlogs');

const api = supertest(app);

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(testBlogs);
  });

  test('correct number of blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, testBlogs.length);
  });

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');
    assert.ok(response.body[0].id);
    assert.strictEqual(response.body[0]._id, undefined);
  });

  test('a blog cannot be added without a token', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    };

    await api.post('/api/blogs').send(newBlog).expect(401);
  });

  describe('when there is a valid token', () => {
    let token;

    beforeEach(async () => {
      await User.deleteMany({});
      const passwordHash = await bcrypt.hash('sekret', 10);
      const newUser = new User({ username: 'root', passwordHash });
      await newUser.save();

      const loginResponse = await api.post('/api/login').send({
        username: 'root',
        password: 'sekret',
      });

      token = loginResponse.body.token;
    });

    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogs = await api.get('/api/blogs');
      const { body } = blogs;
      assert.strictEqual(body.length, testBlogs.length + 1);
      const lastBlog = body[body.length - 1];
      delete lastBlog.user;
      assert.deepStrictEqual(lastBlog, { ...newBlog, id: lastBlog.id });
    });

    test('if the title property is missing from the request, the server returns a 400 status code', async () => {
      const newBlog = {
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);
    });

    test('updating a blog', async () => {
      const blogsAtStart = await api.get('/api/blogs');
      const blogToUpdate = blogsAtStart.body[0];
      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await api.get('/api/blogs');
      assert.strictEqual(blogsAtEnd.body[0].likes, updatedBlog.likes);
    });

    test.only('deleting a blog', async () => {
      const newBlog = {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
      };

      const saveResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`);

      await api
        .delete(`/api/blogs/${saveResponse.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await api.get('/api/blogs');
      assert.strictEqual(blogsAtEnd.body.length, testBlogs.length);
    });
  });
});

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await api.get('/api/users');

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await api.get('/api/users');
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length + 1);
    const usernames = usersAtEnd.body.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await api.get('/api/users');

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(result.body.error, 'expected `username` to be unique');
    const usersAtEnd = await api.get('/api/users');
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length);
  });
});

after(() => {
  mongoose.connection.close();
});
