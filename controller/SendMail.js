const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
     user: "tech@findher.work",
    pass: process.env.Email_Key,
  },
});

function sendMail(toEmail, subject, content) {
  try {

    const mailOptions = {
       from: "tech@findher.work",
      to: toEmail,
      subject: subject,
      html: content,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    return true;
    
  } catch (error) {
    console.log(error)
    return false;
  }

}

module.exports = { sendMail };
