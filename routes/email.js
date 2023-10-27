const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const { sendMail } = require("../controller/SendMail");

router.use(express.json());

router.post('/send-email', async (req, res) => {

    let transporter = nodemailer.createTransport({
                                                     host: "smtp.google.com", // SMTP hosts are usually lowercase, consider changing "SMTP.GOOGLE.COM" to "smtp.google.com"
                                                     port: 587,
                                                     secure: false, // true for 465, false for other ports
                                                     auth: {
                                                         user: process.env.EMAIL_USER, // use environment variable
                                                         pass: process.env.EMAIL_PASS, // use environment variable
                                                     },
                                                 });

    // Validate the request body to ensure that 'to', 'subject', and 'html' are provided.
    // This is a basic validation example. Consider using a library like 'joi' for more robust validation.
    if (!req.body.to || !req.body.subject || !req.body.html) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    let mailOptions = {
        from: process.env.EMAIL_USER, // use environment variable or ensure 'from' address is valid
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.html,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        res.send({ message: "Email sent", messageId: info.messageId });
    } catch (error) {
        console.error("Error sending email: ", error);
        res.status(500).send({ error: "Failed to send email" }); // Consider not exposing detailed server errors to the frontend
    }
});

module.exports = router;
