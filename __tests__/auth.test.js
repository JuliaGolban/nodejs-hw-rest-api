const mongoose = require('mongoose');
const request = require('supertest');

require('dotenv').config();
const { PORT, DB_TEST_HOST } = process.env;

const app = require('../app');
const { signup } = require('../controllers/authController');
const { User } = require('../models/usersModel');

describe('Auth Controller', () => {
  let server;
  beforeAll(() => (server = app.listen(PORT)));
  afterAll(() => server.close());

  beforeEach(done => {
    User.deleteMany();
    mongoose.set('strictQuery', false);
    mongoose.connect(DB_TEST_HOST).then(() => done());
  });

  afterEach(done => {
    mongoose.disconnect(DB_TEST_HOST).then(() => done());
  });

  describe('sign-up process', () => {
    const candidate = {
      username: 'username',
      email: 'email@test.com',
      password: 'password',
    };

    beforeEach(async () => {
      await User.deleteMany();
    });

    it('should register a new user and return 201 Created', async () => {
      await request(app)
        .post('/api/users/signup')
        .send(candidate)
        .set('Accept', 'application/json')
        .expect(201);

      const user = await User.findOne({ email: candidate.email });
      expect(user.username).toBe(candidate.username);
      expect(user.email).toBe(candidate.email);
      expect(user.password).toBeDefined();
      expect(user.password).not.toBe(candidate.password);
      expect(user.subscription).toBeDefined();
      expect(user.avatarURL).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(user.createdAt.getDate === user.updatedAt.getDate).toBe(true);
    });

    it('should throw an 401 error if the user email already exists', async () => {
      User.findOne = jest.fn(data => data);
      await expect(() =>
        signup(candidate).rejects.toThrow('Email is already in use')
      );
    });
  });
});
