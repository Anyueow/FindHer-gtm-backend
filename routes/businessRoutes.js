const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Business = require("../models/business");
const GuestBusinness  = require("../models/GuestBusinness ");
const htmlSanitize = require("../middleware/htmlSanitize");
const router = express.Router();
router.use(express.json());
const { sendMail } = require("../controller/SendMail");
// const app = express();


// app.use(bodyParser.json());

// mongoose.connect("mongodb://localhost:27017/businessDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

router.post("/business/joinnow", htmlSanitize, async (req, res) => {
  try {
    const { name, companyName ,email} = req.body;
    console.log(req.body,"gg");
    if (!name || !companyName || !email ) {
      return res.status(400).json({
        status: "error",
        message: "Please fill out all fields",
      });
    }
    
    const newBusiness = new GuestBusinness ({
      name: name,
      email:email,
      companyName: companyName,
    });

    let reg = await newBusiness.save();

    if (reg) {
     let result= await sendMail(email,"FindHer - Where Top Female Talent Meets Top Female Employers",content);
     console.log("res",result);
      res.status(201).json({ message: "Guest profile created successfully" });
   } else {
     console.error("Error occurred:", error);
     res.status(500).json({ message: "Internal server error." });
   }

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Server error.",
    });
  }
});

router.put("/business/update/email/:businessId", async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const { personName, email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const update = {
      "location.personName": personName,
      password: hashedPassword,
    };

    if (email) {
      update["location.email"] = email;
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      update,
      { new: true }
    );

    if (!updatedBusiness) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json(updatedBusiness);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/business/update/phone/:businessId", async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const { personName, phone, password } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "phone is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const update = {
      "location.personName": personName,
      password: hashedPassword,
    };

    if (phone) {
      update["location.email"] = phone;
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      update,
      { new: true }
    );

    if (!updatedBusiness) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json(updatedBusiness);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to update business with more information
router.put("/business/update-details/:businessId", async (req, res) => {
  const { businessId } = req.params;
  const { employees_count, office_type, industry, summary } = req.body;

  try {
    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (employees_count) {
      business.locations[0].employees_count = employees_count;
    }

    if (office_type) {
      business.locations[0].office_type = office_type;
    }

    if (industry) {
      business.industry = industry;
    }

    if (summary) {
      business.summary = summary;
    }

    const updatedBusiness = await business.save();
    return res.status(200).json(updatedBusiness);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error });
  }
});

// New route to update amenities, certificates, programs, and notes
router.put(
  "/business/update-extras/:businessId/:locationIndex",
  async (req, res) => {
    const businessId = req.params.businessId;
    const locationIndex = req.params.locationIndex;
    const { amenities, certifications, programs, notes } = req.body;

    try {
      const business = await Business.findById(businessId);
      const location = business.locations[locationIndex];

      if (amenities) location.amenities = amenities;
      if (certifications) location.certifications = certifications;
      if (programs) location.programs = programs;
      if (notes) location.notes = notes;

      await business.save();
      res.json({ success: true, message: "Updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to update" });
    }
  }
);


router.post("/business/register", htmlSanitize, async (req, res) => {
  console.log("/business/register")
  try {

    const {companyName, name, email, website, hq, offices, organizationSize, industry, overview, hiring, culture, policies, addInfo, more, workplaceOffers,otherSpecify } = req.body;

    if (!companyName || !name || !email || !website || !hq || !offices || !organizationSize || !industry || !overview || !hiring || !culture || !policies || !addInfo || !more ) {
      return res.status(400).json({
        status: "error",
        message: "Please fill out all the fields.",
      });
    }

  const workplaceOffersArray = Object.entries(workplaceOffers)
  .filter(([key, value]) => value === true)
  .map(([key, value]) => key);
  
    const newBusiness = new Business({
      companyName: companyName,
      name: name,
      email: email,
      website: website,
      organizationSize: organizationSize,
      industry: industry,
      overview: overview,
      hiring: hiring,
      culture: culture,
      policies: policies,
      addInfo: addInfo,
      more: more,
      workplaceOffers: workplaceOffersArray,
      otherSpecify:otherSpecify,
      locations: 
        {
          hq: hq,
          offices: offices ? offices.split(',').map((office) => office.trim()) : []
        },
    });

    await newBusiness.save();

    return res.status(201).json({
      status: "success",
      message: "Company details registered successfully.",
      companyId: newBusiness._id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({status: "error",message: "Internal server error.", });
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
            max-width: 600px;
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

        .btn {
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

        .btn-container {
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

        .btn {
            display: flex;
            background: rgba(217, 217, 217, 0.08);
            height: 50%;
            width: 50%;
            box-shadow: 0px 0px 40px 4px rgba(0, 0, 0, 0.15);
            border-radius: 70px;
            border: 1px rgba(103.06, 103.06, 103.06, 0.18) solid;
            justify-content: center;
            align-items: center;
            align-content: center;
        }

        .btn-text {
            text-align: center;
            color: black;
            font-size: 120%;
            font-weight: 700;
            word-wrap: break-word;
            font-family: Poppins;
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
            width: 100%;
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
        <h1 class="thnakyou"> Thank you for your<br/> interest in FindHer!</h1>
        <h3 class="grey Readyto"> Ready to explore how FindHer can make a<br/>  difference for your company? </h3>

        <div class="btn-container">
            <a href="https://calendly.com/ananya__shah/ananya?back=1&month=2023-10" class="btn"  target="_blank">
                <span class="btn-text">Schedule a call with us</span>
                <img src="https://i.ibb.co/K9rg8bh/arrow.png" alt="arrow" class="arrow-img">
            </a>
        </div>

        <img src="https://i.ibb.co/r34kGN9/protoemial.png" class="Company-image" alt="Company image" border="0" />
        
        <h1 class="more-convincing">If you need more convincing, <a href="https://drive.google.com/file/d/13TwQlWPYEDptNsCsRrVIhlpFH_wienIp/view"  target="_blank">click here to </a><br/> <a href="https://drive.google.com/file/d/13TwQlWPYEDptNsCsRrVIhlpFH_wienIp/view"  target="_blank" >access our information packet.</a></h1>
        <h1 class="more-convincing"> Or, you can continue reading below:</h1>
        
        <p class="para">At FindHer, we are guided by the simple belief that a job is more than its description, and candidates are more than resumes. To create the best matches, both sides need information that goes overlooked in traditional job platforms – things like workplace culture, company values, team dynamics, and so on. </p>
        <p class="para">This is a problem that disproportionately impacts women. Why? Because women have unique workplace experiences, face distinct challenges, and prioritize differently in job searches compared to men.</p>

        <p class="para"> Our solution? We've created a platform that makes this essential information available - front and center - enabling businesses and female candidates to connect more effectively.</p>

        <p class="para"> Now, for businesses like yours, this means a more streamlined hiring process, better quality applicants, better cultural fits, and ultimately, a more diverse workforce. </p>

        <h1 class="more-convincing">Here’s how we do this for you:</h1>

        <h1 class="more-convincing1">Standout ​​Company Profile</h1>
        <p class="para1">We'll create a unique company profile for you on FindHer and populate it with valuable information for female applicants not available elsewhere. This will help your business attract top female talent that are aligned with you.</p>

        <h1 class="more-convincing1">Effective Job Matching</h1>
        <p class="para1">We'll create a unique company profile for you on FindHer and populate it with valuable information for female applicants not available elsewhere. This will help your business attract top female talent that are aligned with you. </p>

        <h1 class="more-convincing1">Effortless Insights</h1>
        <p class="para1">We'll create a unique company profile for you on FindHer and populate it with valuable information for female applicants not available elsewhere. This will help your business attract top female talent that are aligned with you.</p>
        <br/>  <br/>  <br/>
        <hr/>
        <h1 class="last-heading"> If you’re ready to onboard your business, book a <br/>time with us here and we’ll get you started.</h1>
        
        <div class="btn-container">
            <a href="https://calendly.com/ananya__shah/ananya?back=1&month=2023-10" class="btn"  target="_blank">
                <span class="btn-text">Schedule a call with us</span>
                <img src="https://i.ibb.co/K9rg8bh/arrow.png" alt="arrow" class="arrow-img">
                
            </a>
        </div>

</div>

<div class="email-footer">
    <h3>With love, from Bangalore ❤️ </h3>
    <div class="container-footer">
        <div class="column"><img src="https://i.ibb.co/C9GG7YD/footerlogo.png" class="footerlogo" alt="footerlogo" border="0"></div>
        <div class="column"> 
            <p class="Contact"> Contact</p>

            <p class="Contact-email"> <a  href="mailto:info@findher.work">info@findher.work</a></p>
            <div class="container-footer1">
                <div class="column1"><a href="https://www.linkedin.com/company/96131931/admin/feed/posts/"  target="_blank"><img src="https://i.ibb.co/FK3RxD2/linkedin.png" class="footerlogoicon" alt="footerlogo" border="0"></a></div>
                <div class="column1"><a href="https://www.instagram.com/findher.work/"  target="_blank"><img src="https://i.ibb.co/PskGh7H/instagram.png" class="footerlogoicon" alt="footerlogo" border="0"></a></div>
                <div class="column1"><a href="mailto:info@findher.work"  target="_blank"><img src="https://i.ibb.co/M9s2mbW/email.png" class="footerlogoicon" alt="footerlogo" border="0"></a></div>
            </div>
        </div>
    </div>
</div>

</body>

</html>
      `

module.exports = router;
