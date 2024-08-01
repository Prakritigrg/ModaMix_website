const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).send('User already exists.');

        user = new User({ name, email, password });
        await user.save();

        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
