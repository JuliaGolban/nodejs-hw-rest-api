// const bcrypt = require('bcrypt');
const { signup } = require('../controllers/authController');
const { User } = require('../models/usersModel');

describe('Auth Service', () => {
  describe('sign-up process', () => {
    it('throw an error if the candidate email already exists', async () => {
      const candidate = {
        username: 'username',
        email: 'email@test.com',
        password: 'password',
      };
      // if the email was found, throw an error
      User.findOne = jest.fn(data => data);
      await expect(() =>
        signup(candidate).rejects.toThrow('Email is already in use')
      );

      // password doesn't hash if the email already exists
      // const spy = jest.spyOn(bcrypt, 'hash');
      // expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should create a candidate if is a new user', async () => {
      const candidate = {
        username: 'username',
        email: 'email@test.com',
        password: 'password',
      };
      // if the email was not found, return null
      User.findOne = jest.fn(() => null);
      User.create = jest.fn(data => data);

      const newUser = await signup(candidate);

      // password hash
      // bcrypt.hash = jest.fn(() => 'bcrypt-hash');
      // expect(bcrypt.hash).toHaveBeenCalledTimes(1);

      await expect(newUser).toStrictEqual({
        username: candidate.username,
        email: candidate.email,
        password: candidate.password,
        // password: 'bcrypt-hash',
      });
    });
  });
});
