const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send-alert-email', async (req, res) => {
    // Here, 'req.body' contains your form data
    const { name, companyName, email } = req.body;

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
                                                     service: "gmail",
                                                     auth: {
                                                         user: "tech@findher.work",
                                                         pass: process.env.Email_Key,
                                                     },
                                                 });

    // Message object
    let message = {
        from: 'tech@findher.work',
        to: 'info@findher.work', // where you want to receive the emails
        subject: 'New Form Submission',
        text: `New submission from ${name} at ${companyName} - ${email}`, // plain text body
        // html: "<p>HTML version of the message</p>" // html body (optional)
    };

    try {
        // Send email
        let info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email: ', error);
        res.status(500).send('Error sending email.');
    }
});

module.exports = router;
