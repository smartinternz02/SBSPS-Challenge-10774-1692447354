const nodemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  service: "Gmail", // e.g., 'Gmail'
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = (email, filename, filePath) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Generated PDF",
    text: "Here is the generated PDF attached.",
    attachments: [
      {
        filename: filename,
        path: filePath,
      },
    ],
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }

    // Delete the generated PDF file after sending the email
    fs.unlinkSync(filePath);
  });
};

module.exports = sendMail;
