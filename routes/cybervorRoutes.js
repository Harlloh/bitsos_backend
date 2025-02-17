// const express = require("express");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const router = express.Router();

// // ✅ Cybervor Email Transporter for "/cybervor"
// const cybervorContactEmail = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.CYBERVOR_EMAIL, // Second email account
//     pass: process.env.CYBERVOR_PASS,
//   },
// });

// // Function to send Cybervor emails
// const cybervorSendEmail = (to, subject, html) => {
//   const mail = {
//     from: "Cybervor Crypto Recovery Agency",
//     to,
//     subject,
//     html,
//   };

//   cybervorContactEmail.sendMail(mail, (error) => {
//     if (error) {
//       console.error("Error sending email:", error);
//     } else {
//       console.log("Email sent successfully to:", to);
//     }
//   });
// };

// // Verify Cybervor transporter
// cybervorContactEmail.verify((error) => {
//   if (error) {
//     console.log("Error verifying Cybervor email:", error);
//   } else {
//     console.log("Cybervor Email Ready to Send");
//   }
// });

// // ✅ Cybervor Complaint Route ("/cybervor")
// router.post("/", (req, res) => {
//   const { name, email, country, occupation, phone, amount, complaint } = req.body;

//   const mailToOwner = {
//     from: name,
//     to: "cybervor47@gmail.com",
//     subject: `${name} just registered a complaint!`,
//     html: `
//       <p>Name: ${name}</p>
//       <p>Email: ${email}</p>
//       <p>Country: ${country}</p>
//       <p>Occupation: ${occupation}</p>
//       <p>Phone: ${phone}</p>
//       <p>Amount: ${amount}</p>
//       <p>Complaint: ${complaint}</p>
//     `,
//   };

//   const mailToUser = {
//     from: "Cybervor Crypto Recovery Agency",
//     to: email,
//     subject: "Complaint Registration Confirmation",
//     html: `<p>Dear ${name},</p>
//       <p>Your complaint registration has been received. Our team will start working on it shortly.</p>
//       <p>You will be contacted via email for further details.</p>
//       <p>Best regards,<br/>Cybervor Inc</p>`,
//   };

//   cybervorContactEmail.sendMail(mailToOwner, (error) => {
//     if (error) {
//       res.json({ status: "ERROR" });
//     } else {
//       cybervorSendEmail(email, mailToUser.subject, mailToUser.html);
//       res.json({ status: "Message Sent" });
//     }
//   });
// });

// module.exports = router;


const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

// 🔥 Cybervor Email Transporter
const cybervorEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CYBERVOR_EMAIL,
    pass: process.env.CYBERVOR_PASS,
  },
});

// Function to send emails
const sendCybervorEmail = (to, subject, html) => {
  const mail = {
    from: "Cybervor Crypto Recovery Agency",
    to,
    subject,
    html,
  };

  cybervorEmail.sendMail(mail, (error) => {
    if (error) {
      console.error("❌ Error sending email:", error);
    } else {
      console.log("✅ Email sent successfully to:", to);
    }
  });
};

// ✅ Complaint Route for Cybervor
router.post("/", (req, res) => {
  const { name, email, country, occupation, phone, amount, complaint } = req.body;

  const mailToOwner = {
    from: name,
    to: "cybervor47@gmail.com",
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
    from: "Cybervor Crypto Recovery Agency",
    to: email,
    subject: "Complaint Registration Confirmation",
    html: `<p>Dear ${name},</p>
      <p>Your complaint has been received. Our team will review and contact you.</p>
      <p>Best regards,<br/>Cybervor Inc</p>`,
  };

  cybervorEmail.sendMail(mailToOwner, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      sendCybervorEmail(email, mailToUser.subject, mailToUser.html);
      res.json({ status: "Message Sent" });
    }
  });
});

module.exports = router;
