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
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FindHer Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            margin: 20px auto;
            margin-bottom: 0;
            background-color: #ffffff;
            border-radius: 5px;
        }

        .email-header {
            text-align: center;
            margin-bottom: 0px;
            padding: 20px;
            padding-bottom: 0;
        }

        .email-content {
            margin-bottom: 20px;
            padding: 20px;
        }

        .btn1 {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 5px;
            background-color: #3498db;
            color: #ffffff;
            text-decoration: none;
        }

        .reasons {
            margin: 20px 0;
        }

        .reason {
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
        }


        .imagemid {
            width : 40%;
        }

        .grey {
            color: #757575;
        }

        .btn-container1 {
            position: relative;
            display: flex !important;
            font-family: 'Poppins', sans-serif;
            text-align: center;
            justify-content: center;
            align-items: center;
            align-content: center;
            height: 60px;
            margin-top: 50px;
        }

        .btn1 {
            display: flex;
            background: rgba(217, 217, 217, 0.08);
            height: 50%;
            width: 35%;
            margin-left: 30%;
            box-shadow: 0px 0px 40px 4px rgba(0, 0, 0, 0.15);
            border-radius: 70px;
            border: 1px rgba(103.06, 103.06, 103.06, 0.18) solid;
            justify-content: center;
            align-items: center;
            align-content: center;
        }

        .btn-text1 {
            text-align: center;
            color: black;
            font-size: 120%;
            font-weight: 700;
            word-wrap: break-word;
            font-family: Poppins;
            margin-top: 5px;
        }

        .thnakyou{
            text-align: center;
            font-size: 200%;
            margin-top: 0px;
            font-family: Poppins;
        }
        .more-convincing{
            margin-left: 10%;
            margin-right: 5%;
            font-size: 150%;
            margin-top: 30px;
            font-family: Poppins;
        }
        .more-convincing1{
            margin-left: 10%;
            margin-right: 5%;
            font-size: 120%;
            margin-top: 0px;
            font-family: Poppins;
        }
        .more-convincing a{
            color: #EA394A;
            font-family: Poppins;
        }
        .last-heading{
            font-size: 140%;
            margin-top: 30px;
            font-family: Poppins;
            text-align: center;
            line-height: 30px;
            margin-bottom: 40px;
        }
        .para{
            margin-left: 10%;
            margin-right: 5%;
            font-size: 110%;
            margin-top: 30px;
            color: #676767;
            font-family: Poppins;
        }
        .para1{
            margin-left: 10%;
            margin-right: 5%;
            font-size: 110%;
            margin-top: 0px;
            color: #828282;
            font-family: Poppins;
        }
        .para-img{
            margin-left: 10%;
            margin-bottom: 60px;
            width: 80%;
        }
        .Readyto{
            text-align: center;
            font-size: 120%;
            margin-top: 30px;
            font-family: Poppins;
        }
        .Company-image{
            margin-top: 60px;
            width: 100%;   
        }
        .arrow-img{
            width: 20%;
            margin-top: 10px;
            margin-left: 10px;
        }
        .email-footer{
            background: rgba(217, 217, 217, 0.10);
        }
        .email-footer h3{
            text-align: center;
            font-size: 120%;
            padding-top: 60px;
            font-family: Poppins;
            color: var(--Subtle-grey, #979797);
            font-style: normal;
            font-weight: 500;
            line-height: normal;

        }
        .container-footer {
            display: flex;
        }
        .container-footer1 {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
        }
        .column {
            flex: 1;
            padding: 10px;
            padding-right: 30px;
        }
        .column1 {
            flex: -0.5;
            padding: 10px;
        }
        .footerlogo{
            width: 90%;
            padding-bottom: 30px;
        }
        .footerlogoicon{
            width: 30px;
            padding-bottom: 0px;
        }
        .Contact{
            font-size: 150%;
            margin-top: 30px;
            margin-left: 15%;
            font-weight: 600;
            font-family: Poppins;
            text-align: center;
            line-height: 30px;
            margin-bottom: 0;
        }
        .Contact-email{
            font-size: 120%;
            margin-top: 0px;
            margin-bottom: 0px;
            font-weight: 500;
            font-family: Poppins;
            text-align: right;
            line-height: 30px;
            color: #EA394A;
            text-decoration-line: underline;
        }
        .Contact-email a{
            color: #EA394A;
        }
    </style>
</head>

<body>

<div class="email-container">

    <div class="email-header">
        <img src="https://i.ibb.co/6rMmDTM/Findher-Logo-Horizontal-Long.png" alt="FindHer Logo" class="imagemid"/>
    </div>

    <div class="email-content">
        <h1 class="thnakyou"> You’re set!!</h1>
        <h3 class="grey Readyto"> If you're ready to supercharge your job<br/>   search and receive tailored job openings <br/>  directly in your inbox, get started here. </h3>

        <div class="btn-container1">
            <a href="https://airtable.com/appbWBtB4y2MRltIZ/shrHIGlMWk2nDbrO6" target="_blank" class="btn1">
                <span class="btn-text1">Fill out this quick form </span>
                <img src="https://i.ibb.co/K9rg8bh/arrow.png" alt="arrow" class="arrow-img">
            </a>
        </div>

        <img src="https://i.ibb.co/r34kGN9/protoemial.png" class="Company-image" alt="Company image" border="0" />
        
        <h1 class="more-convincing">If you want to learn more about how we can <br/>  help you, read on. </h1>
        
        <p class="para">At FindHer, we believe a job is more than just a job description, and candidates are more than mere resumes. We understand that both sides of the job-seeking equation need more than what traditional job platforms offer.  </p>

        <p class="para">And this is especially true for women, who often have unique work experiences, face distinct challenges, and prioritize different factors when searching for the perfect job.</p>

        <p class="para">Our solution? We've created a platform that puts this vital information front and center, enabling top female candidates to connect more effectively with top female employers. We ensure you find an environment where you can succeed, grow, and truly belong. </p>

        <h1 class="more-convincing">Here’s how we do this for you:</h1>
        
        <h1 class="more-convincing1">Company Insights</h1>
        <p class="para1">We delve deep into workplaces, revealing invaluable insights into their cultures, values, and the real experiences of female employees. You deserve to know what it's truly like to work somewhere before you apply.</p>

        <h1 class="more-convincing1">Tailored Job Matching</h1>
        <p class="para1">Our cutting-edge AI technology ensures you're matched with job opportunities that align perfectly with your skills, aspirations, and unique preferences. We save you time by filtering and showing you the best fits only. </p>

        <h1 class="more-convincing1">Resources and info</h1>
        <p class="para1">We sift through the noise to bring you the most relevant career-related advice, resources, and upskilling opportunities. Our social channels and newsletters help you stay informed and empowered throughout your job search journey. </p>

        <br/>  <br/>  <br/>
        <hr/>
        <h1 class="last-heading">At FindHer, we’re not just rooting for your success, <br/> we’re making it happen. Ready to join us?</h1>
        
        <div class="btn-container1">
            <a href="https://airtable.com/appbWBtB4y2MRltIZ/shrHIGlMWk2nDbrO6" target="_blank" class="btn1">
                <span class="btn-text1"> Sign up with us here</span>
                <img src="https://i.ibb.co/K9rg8bh/arrow.png" alt="arrow" class="arrow-img">
                
            </a>
        </div>

</div>

<div class="email-footer">
    <h3>With love, from Bangalore ❤️ </h3>
    <div class="container-footer">
        <div class="column"><img src="https://i.ibb.co/C9GG7YD/footerlogo.png" class="footerlogo" alt="footerlogo" border="0"></div>
        <div class="column" style="margin-left: 25%"> 
            <p class="Contact"> Contact</p>

            <p class="Contact-email"> <a  href="mailto:info@findher.work">info@findher.work</a></p>
            <div class="container-footer1">
            <div class="column1"><a href="mailto:info@findher.work"  target="_blank"><img src="https://i.ibb.co/M9s2mbW/email.png" class="footerlogoicon" style="margin-top: 4px" alt="footerlogo" border="0"></a></div>
            <div class="column1"><a href="https://www.instagram.com/findher.work/"  target="_blank"><img src="https://i.ibb.co/PskGh7H/instagram.png" class="footerlogoicon" alt="footerlogo" border="0"></a></div>
            <div class="column1"><a href="https://www.linkedin.com/company/96131931/admin/feed/posts/"  target="_blank"><img src="https://i.ibb.co/FK3RxD2/linkedin.png" class="footerlogoicon" alt="footerlogo" border="0"></a></div> </div>
        </div>
    </div>
</div>

</body>

</html>`;

module.exports = router;
