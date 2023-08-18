const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
                                    _id: {
                                        type: Schema.Types.ObjectId,
                                        auto: true,
                                    },
                                    user: {
                                        type: Schema.Types.ObjectId,
                                        ref: 'User',
                                        required: true
                                    },
                                    companyName: {
                                        type: String,
                                        required: true
                                    },
                                    companyOffice: {
                                        type: String,
                                        required: true
                                    },

                                    positionTitle: {
                                        type: String,
                                        required: true
                                    },
                                    startDate: {
                                        type: String,
                                        required: true
                                    },
                                    endDate: {
                                        type: String,
                                        required: true
                                    },
                                    ratings: {
                                        flexibility: {
                                            type: Number,

                                        },
                                        management: {
                                            type: Number,

                                        },
                                        coworkers: {
                                            type: Number,

                                        },
                                        diversity: {
                                            type: Number,

                                        },
                                        safety: {
                                            type: Number,

                                        },
                                        compensation: {
                                            type: Number,

                                        }
                                    },
                                    goodThings: {
                                        type: String,

                                    },
                                    badThings: {
                                        type: String,

                                    },
                                    amenities: {
                                        type: String
                                    },
                                    benefits: {
                                        type: String
                                    }
                                });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
