require('dotenv').config();
const nodemailer = require('nodemailer');
// const { OAuth2Client } = require('google-auth-library');

// // Configure OAuth2
// const oauth2Client = new OAuth2Client(
//     'YOUR_CLIENT_ID',
//     'YOUR_CLIENT_SECRET',
//     'https://developers.google.com/oauthplayground'
//   );
  
//   oauth2Client.setCredentials({
//     refresh_token: 'YOUR_REFRESH_TOKEN',
//   });
  
  // Create transporter
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       type: 'OAuth2',
//       user: 'alixia.blanchie@gmail.com',
//       clientId: 'YOUR_CLIENT_ID',
//       clientSecret: 'YOUR_CLIENT_SECRET',
//       refreshToken: 'YOUR_REFRESH_TOKEN',
//     },
//   });

// mailtrap
// const transporter = nodemailer.createTransport({
//   host: 'sandbox.smtp.mailtrap.io',
//   port: 587,
//   secure: false, // use SSL
//   auth: {
//     user: '53a64646dcbad6',
//     pass: '351243fda71730',
//   }
// });

// Only use Gmail transporter here
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_PASS
  }
});

const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error });
  }
};

module.exports = {
  sendEmail,
};

