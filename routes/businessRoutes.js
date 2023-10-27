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
        message: "Business name and zip code are required.",
      });
    }
    
    const newBusiness = new GuestBusinness ({
      name: name,
      email:email,
      companyName: companyName,
    });

    let reg = await newBusiness.save();

    if (reg) {
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
              If you’re ready to onboard your business, book a time with us
              <a href={"https://calendly.com/asurana/chat-with-anjali"}>
                  here </a> and we’ll get you started.
              <br/>
              <br/>
      
              If you need more convincing,
              find the  <a href={"https://drive.google.com/file/d/13TwQlWPYEDptNsCsRrVIhlpFH_wienIp/view?usp=sharing"}>
                  info packet linked here </a>  or continue reading below ~
              <br/>
              <br/>
              At FindHer, we are guided by the simple belief that a job is more than its description,
              and candidates are more than resumes.
              To create the best matches, both sides need information that
              goes overlooked in traditional job platforms – <strong> things like workplace culture,
                  company values, team dynamics, and so on.</strong>
      
              This is a problem that disproportionately impacts women.
              Why? Because women have unique workplace experiences,
              face distinct challenges, and prioritize differently
              in job searches compared to men.
      
              <br/>
              <br/>
              Our solution? We've created a platform that makes this essential information available -
              front and center - enabling businesses and female
              candidates to connect more effectively.
              Now, for businesses like yours, this means a
              more streamlined hiring process, better quality applicants,
              better cultural fits, and ultimately, a more diverse workforce
              (and don’t even get us started on the benefits of that).
      
              <br/> <br/>
              Here’s how we do this for you:
              <br/> <br/>
      
              <strong>1) Standout Company Profile:</strong><br/>
              We'll create a unique company profile for you on FindHer and populate it with valuable information for female applicants not available elsewhere. This will help your business attract top female talent that are aligned with you.
              <br/> <br/>
      
              <strong>2) Effective Job Matching:</strong><br/>
              We'll delve deep into compatibility and carefully curate a list of the best candidates for your open roles using our AI. This means you'll spend less time sifting through resumes and more time connecting with candidates who are a great fit for your organization.
              <br/> <br/>
      
              <strong>3) Effortless Insights:</strong> <br/>
              We'll send a survey to your female employees and provide you with confidential insights to easily enhance the female employee experience. We'll also showcase the best of this on your company profile to inspire more applicants. The result? Higher employee satisfaction, retention, and growth.
              <br/><br/>
      
              Ready to explore how FindHer can make a difference for your company?
              Let’s get you started - schedule a call with us <a href={"https://calendly.com/asurana/chat-with-anjali"}>
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
      `
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

module.exports = router;
