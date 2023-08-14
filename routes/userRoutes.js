const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST - Add a new user
router.post('/', async (req, res) => {
    try {
        const { email, phoneNumber, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        // If not, create a new user
        const newUser = new User({
                                     email,
                                     phoneNumber,
                                     password
                                 });


        await newUser.save();
        res.status(201).json({ message: 'User added successfully', user: newUser });

    } catch (error) {
        console.error("Error while adding a user:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
