const service = require('../service/authService');
const verify = require('../service/emailService');

// Registration
const signup = async (req, res) => {
  const user = await service.signup(req.body);
  await verify.sendEmail(user.email, user.verificationToken);
  res.status(201).json({
    user: {
      username: user.username,
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
};

// Login
const login = async (req, res) => {
  const { token, userWithToken } = await service.login(req.body);
  res.json({ token: token, user: userWithToken });
};

// Logout
const logout = async (req, res) => {
  await service.logout(req.user._id);
  res.status(204).json();
};

// Verification the user email
const confirm = async (req, res) => {
  const { verificationToken } = req.params;
  await service.confirm(verificationToken);
  res.json({ message: 'Verification successful' });
};

// Resend the user's confirmation email
const resend = async (req, res) => {
  await service.resend(req.body.email);
  await verify.sendEmail(req.body.email, req.params.verificationToken);
  res.json({ message: 'Verification email sent' });
};

module.exports = { signup, login, logout, confirm, resend };
