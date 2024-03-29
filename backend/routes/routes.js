const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, country, email, password } = req.body;

        const userData = new User({
            firstName,
            lastName,
            country,
            email,
            password
        });

        await userData.save();

        res.status(201).json({ message: 'User registered successfully', userData });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
