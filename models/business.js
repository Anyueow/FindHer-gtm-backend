const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  hq: {
    type: String,
    validate: {
      validator: (value) => {
        return value.length <= 80;
      },
      message: 'Specify can have a maximum of 80 characters.',
    },
  },
  offices: {
    type: [String],
    validate: {
      validator: (values) => {
        return values.every(value => value.length <= 60);
      },
      message: 'Office must not exceed 60 characters.',
    },
  },
});

const businessSchema = new mongoose.Schema({
  companyName: {
    type: String,
    validate:[ 
      {
      validator: function(value) {
        const pattern = /^[a-zA-Z0-9\s.,^&*()_+=~!@#%\-:;?{}[\]'"|\\`]+$/;
        return pattern.test(value);
      },
      message: 'Invalid company name. $, <, > are not allowed'
    },
  {
    validator: function(value) {
      return value.length <= 60;
    },
    message: 'Company name must not exceed 60 characters'
  },
]
},
  name: {
    type: String,
    validate:[ 
      {
      validator: function(value) {
        const pattern = /^[a-zA-Z0-9\s.,^&*()_+=~!@#%\-:;?{}[\]'"|\\`]+$/;
        return pattern.test(value);
      },
      message: 'Invalid company name. $, <, > are not allowed'
    },
  {
    validator: function(value) {
      return value.length <= 30;
    },
    message: 'Name must not exceed 30 characters'
  },
]
  },
  email: {
    type: String,
    validate: [
      {
      validator: function(value) {
        return /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}/g.test(value);
      },
      message: 'Invalid email format',
      },
    ]
  },
  website: {
    type: String,
    validate: [
      {
      validator: function(value) {
        return /^(https?|ftp):\/\/[^\s$.?#].[^\s]*$/.test(value);
      },
      message: 'Invalid url format',
      },
    ]
  },
  organizationSize: {
    type: String,
    validate:[ 
      {
      validator: function(value) {
        const pattern = /^\d+\s*-\s*\d+$/;
        return pattern.test(value);
      },
      message: 'Invalid company name. $, <, > are not allowed'
    },
  {
    validator: function(value) {
      return value.length <= 30;
    },
    message: 'organization size must not exceed 30 characters'
  },
    ],
  },
  industry: {
    type: String,
    validate:[ 
      {
      validator: function(value) {
        const pattern = /^[a-zA-Z0-9\s.,^&*()_+=~!@#%\-:;?{}[\]'"|\\`]+$/;
        return pattern.test(value);
      },
      message: 'Invalid company name. $, <, > are not allowed'
    },
  {
    validator: function(value) {
      return value.length <= 40;
    },
    message: 'Name must not exceed 40 characters'
  },
]
  },
  overview: {
    type: String,
    validate:[ 
      {
      validator: function(value) {
        const pattern = /^(\S+\s*){1,200}$/;
        return pattern.test(value);
      },
      message: 'Overview must not exceed 200 words'
    },
    ],
  },
  hiring: {
    type: String,
    validate:[ 
      {
      validator: function(value) {
        const pattern = /^(\S+\s*){1,200}$/;
        return pattern.test(value);
      },
      message: 'Hiring must not exceed 200 words'
    },
    ],
  },
  culture: {
    type: String,
    validate:[ 
      {
      validator: function(value) {
        const pattern = /^(\S+\s*){1,200}$/;
        return pattern.test(value);
      },
      message: 'Culture must not exceed 200 words'
    },
    ],
  },
  policies: {
    type: String,
    validate:[ 
      {
      validator: function(value) {
        const pattern = /^(\S+\s*){1,200}$/;
        return pattern.test(value);
      },
      message: 'Policies must not exceed 200 words'
    },
    ],
  },
  addInfo: {
    type: String,
    validate:[ 
      {
      validator: function(value) {
        const pattern = /^(\S+\s*){1,200}$/;
        return pattern.test(value);
      },
      message: 'Add info must not exceed 200 words'
    },
    ],
  },
  more: {
    type: String,
    // validate:[ 
    //   {
    //   validator: function(value) {
    //     const pattern = /^(\S+\s*){1,200}$/;
    //     return pattern.test(value);
    //   },
    //   message: 'More info must not exceed 200 words'
    // },
    // ],
  },
  workplaceOffers:{
    type: [String], 
    enum: [
      'flexibleHours',
      'workFromHome',
      'profDevPrograms',
      'parentalLeave',
      'childcareSupport',
      'divInclusionPrograms',
      'retirementPlans',
      'contEducationSupport',
      'employeeDiscounts',
      'commuteAssistance',
      'menstrualLeaves',
      'mentalHealthLeaves',
      'stockOptions',
    ],
  },
  otherSpecify: {
    type: String,
    validate: {
      validator: (value) => {
        return value.length <= 60;
      },
      message: 'Specify can have a maximum of 60 characters.',
    },
  },
  locations: {
    type: locationSchema,
    _id: false, 
  },
});

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;
