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
                                    positionTitle: {
                                        type: String,
                                        required: true
                                    },
                                    startDate: {
                                        type: Date,
                                        required: true
                                    },
                                    endDate: {
                                        type: Date,
                                        required: true
                                    },
                                    ratings: {
                                        flexibility: {
                                            type: Number,
                                            required: true
                                        },
                                        management: {
                                            type: Number,
                                            required: true
                                        },
                                        coworkers: {
                                            type: Number,
                                            required: true
                                        },
                                        diversity: {
                                            type: Number,
                                            required: true
                                        },
                                        safety: {
                                            type: Number,
                                            required: true
                                        },
                                        compensation: {
                                            type: Number,
                                            required: true
                                        }
                                    },
                                    goodThings: {
                                        type: String,
                                        required: true
                                    },
                                    badThings: {
                                        type: String,
                                        required: true
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
