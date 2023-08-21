const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const locationSchema = new Schema({
                                      zipCode: {
                                          type: String,
                                          required: true
                                      },
                                      personName: {
                                          type: String,
                                          required: true,
                                      },
                                      email: {
                                          type: String
                                      },
                                      phone: {
                                          type: String
                                      },
                                      password: {
                                          type: String,
                                          required: true
                                      },
                                      employees_count: {
                                          type: Number
                                      },
                                      office_type: {
                                          type: String,
                                          enum: ["franchise", "branch", "headquarters", "co-working space"]
                                      },
                                      amenities: [{
                                          type: String
                                      }],
                                      certifications: [{
                                          type: String
                                      }],
                                      programs: [{
                                          type: String
                                      }],
                                      notes: {
                                          type: String
                                      }
                                  });

locationSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

locationSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const businessSchema = new Schema({
                                      name: {
                                          type: String,
                                          required: true,
                                          unique: true
                                      },
                                      industry: {
                                          type: String,
                                          required: true
                                      },
                                      summary: {
                                          type: String,
                                          required: true
                                      },
                                      locations: [locationSchema]
                                  });

const Business = mongoose.model('BUSINESS', businessSchema);
module.exports = Business;
