const express = require('express');
const router = express.Router();
const User = require('../models/user');


// getting all users

router.get('/', (req, res) => {
    res.send("shidd this might work");
});
// POST - Add a new user
router.post('/register', async (req, res) => {
    const { email, phoneNumber, password } = req.body;

    // Check if the user has filled out everything
    if (!email || !phoneNumber || !password) {
        return res.status(400).json({ message: 'Please fill out all fields.' });
    }

    try {
        // Check if there is already an existing user with the same email or phone number
        const existingUserEmail = await User.findOne({ email: email });
        if (existingUserEmail) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const existingUserPhone = await User.findOne({ phoneNumber: phoneNumber });
        if (existingUserPhone) {
            return res.status(400).json({ message: 'Phone number already in use.' });
        }

        // Create new user
        const newUser = new User({
                                     email,
                                     phoneNumber,
                                     password
                                 });

        const userReg = await newUser.save();

        if(userReg) {
            // Return success message
            res.status(201).json({message: 'User successfully registered.'});
        } else {         console.error('Error occurred:', error);
            res.status(500).json({ message: 'Internal server error.' })
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
