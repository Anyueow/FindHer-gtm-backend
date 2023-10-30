const express = require("express");
const router = express.Router();
const GuestProfile = require("../models/guestProfile");
const htmlSanitize = require("../middleware/htmlSanitize");
const { sendMail } = require("../controller/SendMail");
router.use(express.json());

router.post("/guestProfile", htmlSanitize, async (req, res) => {
  console.log("holaaa", req.body);
  const { email, phoneNumber, firstName, lastName, linkedinProfile } = req.body;

  // Check if the user has filled out everything

  if (!email || !phoneNumber || !firstName || !lastName) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  try {
    const guest = new GuestProfile({
      email,
      phoneNumber,
      firstName,
      lastName,
      linkedinProfile,
    });

    const guestReg = await guest.save();

    if (guestReg) {
      let result = await sendMail(
        email,
        "FindHer - Where Top Female Talent Meets Top Female Employers",
        content
      );
      res.status(201).json({ message: "Guest profile created successfully" });
    } else {
      console.error("Error occurred:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      // Mongoose validation error
      const validationErrors = Object.values(error.errors).map(
        (error) => error.message
      );
      console.error("Validation errors occurred:", validationErrors[0]);
      res.status(400).json({ message: validationErrors[0] });
    } else {
      // Other types of errors
      console.error("Error occurred:", error.message);
      res.status(500).json({ message: error.message });
    }
  }
});

let content = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-weight: normal; /* Avoids bold, adjust as needed */

        }
        .email-container, .footer {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }
        .email-container {
            background-color: #ffffff;
            padding: 20px;
            box-sizing: border-box;
        }
        .email-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .email-header img {
            max-width: 150px; /* Adjust based on your logo's dimensions */
        }
        .footer {
            background-color: rgba(226, 11, 60, 0.83);
            color: white;
            text-align: center;
            padding: 30px;
            font-size: 16px;
            box-sizing: border-box;
        }
        .footer .menu a {
            color: white;
            text-decoration: none;
            font-size: 21px;
            font-weight: 500;
            padding: 10px;
        }
        .footer .icons a {
            display: inline-block;
            margin: 0 10px;
            color: white;
            text-decoration: none;
        }
        .footer .icons i {
            font-size: 36px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            color: white;
            background-color: rgba(226, 11, 60, 0.83); /* Your brand color */
            border: none;
            border-radius: 15px;
            text-decoration: none;
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

</head>
<body>

<div class="email-container">
    <!-- Logo section -->
    <div class="email-header">
        <img src="https://i.ibb.co/6rMmDTM/Findher-Logo-Horizontal-Long.png" alt="FindHer Logo"> <!-- Replace with your actual logo URL -->
    </div>

    <!-- Email body -->
    <h3>Hi there,</h3>
    <!-- Include the rest of your email content -->
    <h4>Thank you for your interest in FindHer.<br/>
        <br/>
        If you’re ready to supercharge your job search and receive tailored job openings directly in your inbox,
        <a href={"https://calendly.com/asurana/chat-with-anjali"}>
            here </a> sign up here.
        <br/>
        <br/>

        For those who need a bit more persuasion, read on:
        <br/>
        <br/>
        At FindHer, we believe a job is more than just a job description, and candidates are more than mere resumes. We understand that both sides of the job-seeking equation need more than what traditional job platforms offer. And this is especially true for women, who often have unique work experiences, face distinct challenges, and prioritize different factors when searching for the perfect job.
        This is a problem that disproportionately impacts women.
        Why? Because women have unique workplace experiences,
        face distinct challenges, and prioritize differently
        in job searches compared to men.

        <br/>
        <br/>
        Our solution? We’ve created a platform that puts this vital information front and center, enabling top female candidates to connect more effectively with top female employers. We ensure you find an environment where you can succeed, grow, and truly belong.

        <br/> <br/>
        Here’s how we do that:
        <br/> <br/>

        <strong>1) Company Insights:</strong><br/>
        We delve deep into workplaces, revealing invaluable insights into their cultures, values, and the real experiences of female employees. You deserve to know what it’s truly like to work somewhere before you apply.
        <br/> <br/>

        <strong>2) Tailored Job Matching:</strong><br/>
        Our cutting-edge AI technology ensures you’re matched with job opportunities that align perfectly with your skills, aspirations, and unique preferences. We save you time by filtering and showing you the best fits only.
        <br/> <br/>

        <strong>3)Resources and info: <br/>
        We sift through the noise to bring you the most relevant career-related advice, resources, and upskilling opportunities. Our social channels and newsletters help you stay informed and empowered throughout your job search journey.
        <br/><br/>

        At FindHer, we’re not just rooting for your success, we’re making it happen.

        Ready to join us? - Sign up with us <a href={"https://calendly.com/asurana/chat-with-anjali"}>
            here. </a>

        <br/><br/>
        Best,<br/>
        Anjali & Ananya<br/>
        <i>Two 21 year olds trying to change the face of work in India</i>

    </h4>

    <!-- Call to action -->
    <div style="text-align: center; margin: 20px 0;">
        <a href="#" class="button">Book a Time</a> <!-- Replace '#' with your actual booking link -->
    </div>
</div>

<!-- Footer -->
<div class="footer">
    <p>Stay in touch with us :) </p>
    <div class="icons">
        <!-- Email icon -->
        <a href="mailto:info@findher.work" style="color: white; margin: 0 10px; text-decoration: none;">
            <i class="fas fa-envelope" style="font-size: 36px;"></i>
        </a>

        <!-- LinkedIn icon -->
        <a href="https://www.linkedin.com/company/find-her/" target="_blank" rel="noopener noreferrer" style="color: white; margin: 0 10px; text-decoration: none;">
            <i class="fab fa-linkedin" style="font-size: 36px;"></i>
        </a>

        <!-- Instagram icon -->
        <a href="https://www.instagram.com/findher.work/" target="_blank" rel="noopener noreferrer" style="color: white; margin: 0 10px; text-decoration: none;">
            <i class="fab fa-instagram" style="font-size: 36px;"></i>
        </a>

    </div>

    <div class="address">
        <p>With love - from Bangalore, India</p>
        <p>© 2023 FindHer. All rights reserved.</p>
    </div>
</div>
</body>
</html>
`;

module.exports = router;
