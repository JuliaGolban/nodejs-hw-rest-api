const sgMail = require('@sendgrid/mail');

require('dotenv').config();
const { PORT, SENDGRID_API_KEY } = process.env;

const BASE_URL = `http://localhost:${PORT}/api`;
const sender = 'julia.j.shcherban@gmail.com';

sgMail.setApiKey(SENDGRID_API_KEY);

const verification = async (email, code) => {
  const link = `${BASE_URL}/users/verify/${code}`;
  const msg = {
    to: email,
    from: sender,
    subject: 'Please Verify Your Email Address',
    text: "Let's verify your email address so you can complete your registration",
    html: `<strong>Let's verify your email address so you can complete your registration:</strong><br/><a href=${link} target="_blank">Confirm</a>`,
  };
  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

const passwordReset = async data => {
  const link = `${BASE_URL}/users/password-reset/${data._id}/${data.verificationToken}`;
  const msg = {
    to: data.email,
    from: sender,
    subject: 'Reset password',
    text: "Let's reset your current password so you can complete your login",
    html: `<p>Hi, ${data.username}.</p></br><p>Let's reset your current password so you can complete your login.</p><br/><p>Please, click the link below to reset uour password:</p><br/><a href=${link} target="_blank">Reset Password</a>`,
  };
  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = { verification, passwordReset };
