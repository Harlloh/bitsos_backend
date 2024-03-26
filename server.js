const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const router = express.Router();
require("dotenv").config();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/", router);
app.listen(3002, () => console.log("Server running"));

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send emails
const sendEmail = (to, subject, html) => {
  const mail = {
    from: "Crypto Recovery Agency",
    to,
    subject,
    html,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent successfully");
    }
  });
};

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const country = req.body.country;
  const occupation = req.body.occupation;
  const phone = req.body.phone;
  const amount = req.body.amount;
  const complaint = req.body.complaint;

  // Email content to Asher Praise Concert
  const mailToAsher = {
    from: name,
    to: "support@cyberhelponline.org",
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

  // Email content to user
  const mailToUser = {
    from: "Crypto Recovery Agency",
    to: email,
    subject: "Complaint Registration Confirmation",
    html: `<p>Dear ${name},</p>
      <p>Your complaint registration has been received. Our team will start working on it shortly.</p>
      <p>You will be contacted via email for further details.</p>
      <p>Best regards,<br/>Shieldcrypt inc</p>`,
  };

  // Sending emails
  contactEmail.sendMail(mailToAsher, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      // Send welcome email to user
      sendEmail(email, mailToUser.subject, mailToUser.html);

      res.json({ status: "Message Sent" });
    }
  });
});
