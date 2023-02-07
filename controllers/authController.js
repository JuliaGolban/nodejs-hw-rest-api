const service = require('../service/authService');
const sendEmail = require('../helpers/sendEmail');

// Registration
const signup = async (req, res) => {
  const user = await service.signup(req.body);
  const { username, email, subscription, avatarURL, verificationToken } = user;
  await sendEmail.verification(email, verificationToken);
  res.status(201).json({
    user: {
      username: username,
      email: email,
      subscription: subscription,
      avatarURL: avatarURL,
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
  await sendEmail.verification(req.body.email, req.params.verificationToken);
  res.json({ message: 'Verification email sent' });
};

// Send password reset link
const linkPassword = async (req, res) => {
  const user = await service.linkPassword(req.body.email);
  await sendEmail.passwordReset(user);
  res.json({ message: 'Password reset link sent to user email account' });
};

// Reset user password
const changePassword = async (req, res) => {
  const { userId, verificationToken } = req.params;
  const { password } = req.body;
  await service.changePassword(userId, verificationToken, password);
  res.json({ message: 'Password reset successfully' });
};

module.exports = {
  signup,
  login,
  logout,
  confirm,
  resend,
  linkPassword,
  changePassword,
};
