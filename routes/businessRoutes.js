const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Business = require("../models/business");
const GuestBusinness  = require("../models/GuestBusinness ");
const htmlSanitize = require("../middleware/htmlSanitize");
const router = express.Router();
router.use(express.json());
// const app = express();
const port = process.env.PORT || 3000;

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

    await newBusiness.save();

    return res.status(201).json({
      status: "success",
      message: "Business registered successfully.",
      businessId: newBusiness._id,
    });
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
