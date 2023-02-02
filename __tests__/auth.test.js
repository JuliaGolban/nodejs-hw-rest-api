const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
const { PORT, DB_TEST_HOST, SECRET_KEY } = process.env;

const app = require('../app');
const { User } = require('../models/usersModel');

describe('Auth Controller', () => {
  let server;

  beforeAll(async () => {
    await jest.setTimeout(150 * 1000);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await jest.setTimeout(5 * 1000);
    server.close();
  });

  beforeEach(done => {
    mongoose.set('strictQuery', false);
    mongoose.connect(DB_TEST_HOST).then(() => done());
  });

  afterEach(done => {
    mongoose.disconnect(DB_TEST_HOST).then(() => done());
  });

  // add user for checking exist
  const userId = new mongoose.Types.ObjectId();
  const mUser = {
    _id: userId,
    username: 'user',
    email: 'useremail@test.com',
    password: 'password',
    token: jwt.sign({ _id: userId }, SECRET_KEY),
  };

  beforeEach(async () => {
    await User.deleteMany();
    const user = new User(mUser);
    await user.save();
  });

  describe('sign-up process', () => {
    const candidate = {
      username: 'candidate',
      email: 'newemail@test.com',
      password: 'password',
    };

    it('should register a new user and return 201 Created', async () => {
      const response = await request(app)
        .post('/api/users/signup')
        .send(candidate)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);

      const { username, email, subscription, avatarURL } = response.body.user;
      expect(username).toBe(candidate.username.toString());
      expect(email).toBe(candidate.email.toString());
      expect(subscription).toBe('starter');
      expect(avatarURL).toBeDefined();

      const RegisteredUser = await User.findOne({ email: email });
      expect(RegisteredUser.password).toBeDefined();
      expect(RegisteredUser.password).not.toBe(candidate.password);
    });

    it('should throw an error if the user email already exists', async () => {
      await request(app)
        .post('/api/users/signup')
        .send({
          username: mUser.username,
          email: mUser.email,
          password: mUser.password,
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401);
    });
  });

  describe('log-in process', () => {
    it('should login existing user and created token', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({ email: mUser.email, password: mUser.password })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      const { username, email, subscription, avatarURL } = response.body.user;
      const { token } = response.body;

      expect(username).toBe(mUser.username.toString());
      expect(email).toBe(mUser.email.toString());
      expect(subscription).toBe('starter');
      expect(avatarURL).toBeDefined();
      expect(token).not.toBeNull();

      const loggedUser = await User.findOne({ email: email });
      expect(loggedUser.password).toBeDefined();
    });

    it('should throw an error if the user does not exist', async () => {
      await request(app)
        .post('/api/users/login')
        .send({ email: mUser.email, password: 'wrong' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401);
    });
  });

  describe('log-out process', () => {
    it('should logout already login user', async () => {
      const loggedUser = {
        email: mUser.email,
        password: mUser.password,
      };
      const result = await request(app)
        .post('/api/users/login')
        .send(loggedUser)
        .expect(200);

      await request(app)
        .get('/api/users/logout')
        .set('Authorization', `Bearer ${result.body.token}`)
        .expect(204);
    });

    it('should throw an error 401 Unauthorized if the token is invalid', async () => {
      const mToken = jwt.sign({ _id: uuidv4 }, SECRET_KEY);
      await request(app)
        .get('/api/users/logout')
        .set('Authorization', `Bearer ${mToken}`)
        .expect(401);
    });
  });
});
