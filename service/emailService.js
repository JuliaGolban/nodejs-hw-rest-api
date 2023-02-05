const sgMail = require('@sendgrid/mail');

require('dotenv').config();
const { PORT, SENDGRID_API_KEY } = process.env;

const BASE_URL = `http://localhost:${PORT}/api`;
const sender = 'julia.j.shcherban@gmail.com';

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data, code) => {
  const link = `${BASE_URL}/users/verify/${code}`;
  const msg = {
    to: data,
    from: sender,
    subject: 'Please Verify Your Email Address',
    text: "Let's verify your email address so you can complete your registration",
    html: `<strong>Let's verify your email address so you can complete your registration</strong><br/><a href=${link} target="_blank">Confirm</a><br/><p>Your link is active for 48 hours. After that, you will need to resend the verification email.</p>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent successfully');
      return true;
    })
    .catch(error => {
      console.error(error.message);
    });
};

module.exports = { sendEmail };
