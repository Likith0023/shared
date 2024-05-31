// // functions/index.js (Firebase Cloud Function)
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const nodemailer = require('nodemailer');

// admin.initializeApp();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'your-email@gmail.com',
//     pass: 'your-email-password',
//   },
// });

// exports.sendEmail = functions.https.onRequest((req, res) => {
//   const { email, url, code } = req.body;

//   const mailOptions = {
//     from: 'your-email@gmail.com',
//     to: email,
//     subject: 'Your Download Link',
//     text: `Here is your download link: ${url}\nYour code: ${code}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send(error.toString());
//     }
//     return res.status(200).send('Email sent: ' + info.response);
//   });
// });
