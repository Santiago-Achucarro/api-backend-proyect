const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.user_mailer,
    pass: process.env.pass_mailer,
  },
});

module.exports = transport;
