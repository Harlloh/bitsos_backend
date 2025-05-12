const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

// 📩 Email Transporter for Complaints
const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify Email Connection
contactEmail.verify((error) => {
  if (error) {
    console.log("❌ Error verifying email:", error);
  } else {
    console.log("✅ Ready to Send Emails");
  }
});

// ✅ Main Complaint Route
router.post("/", (req, res) => {
  const { name, email, country, occupation, phone, amount, complaint } = req.body;

  const mailToOwner = {
    from: name,
    to: "support@shieldcrypt.help",
    subject: `${name} just registered a complaint!`,
    html: `
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Country: ${country}</p>
      <p>Whatsapp Number: ${occupation}</p>
      <p>Phone: ${phone}</p>
      <p>Amount: ${amount}</p>
      <p>Complaint: ${complaint}</p>
    `,
  };

  const mailToUser = {
    from: "Crypto Recovery Agency",
    to: email,
    subject: "Complaint Registration Confirmation",
    html: `<p>Dear ${name},</p>
      <p>Your complaint has been received. Our team will contact you soon.</p>
      <p>Best regards,<br/>Shieldcrypt Inc</p>`,
  };

  contactEmail.sendMail(mailToOwner, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      contactEmail.sendMail(mailToUser, () => {});
      res.json({ status: "Message Sent" });
    }
  });
});

module.exports = router;
