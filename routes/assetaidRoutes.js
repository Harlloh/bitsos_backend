const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

// 🔥 BitRescue Email Transporter
const BitRescueEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ASSESTAID_EMAIL,
    pass: process.env.ASSETAID_PASS,
  },
});

// Function to send emails
const sendBitRescueEmail = (to, subject, html) => {
  const mail = {
    from: `${process.env.ASSESTAID_NAME} Crypto Recovery Agency`,
    to,
    subject,
    html,
  };

  BitRescueEmail.sendMail(mail, (error) => {
    if (error) {
      console.error("❌ Error sending email:", error);
    } else {
      console.log("✅ Email sent successfully to:", to);
    }
  });
};

// ✅ Complaint Route for BitRescue
router.post("/", (req, res) => {
  const { name, email, country, occupation, phone, amount, complaint } = req.body;

  const mailToOwner = {
    from: name,
    to: "Assetaid001@gmail.com",
    subject: `${name} just registered a complaint!`,
    html: `
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Country: ${country}</p>
      <p>Occupation: ${occupation}</p>
      <p>Phone: ${phone}</p>
      <p>Amount: ${amount}</p>
      <p>Complaint: ${complaint}</p>
    `,
  };

  const mailToUser = {
    from: `${process.env.ASSESTAID_NAME} Crypto Recovery Agency`,
    to: email,
    subject: "Complaint Registration Confirmation",
    html: `<p>Dear ${name},</p>
      <p>Your complaint has been received. Our team will review and contact you soon.</p>
      <p>Best regards,<br/>${process.env.ASSESTAID_NAME}</p>`,
  };

  BitRescueEmail.sendMail(mailToOwner, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      sendBitRescueEmail(email, mailToUser.subject, mailToUser.html);
      res.json({ status: "Message Sent" });
    }
  });
});

module.exports = router;
