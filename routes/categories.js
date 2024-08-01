const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Create a new category
router.post('/categories', async (req, res) => {
    const { name, description } = req.body;

    try {
        let category = await Category.findOne({ name });
        if (category) return res.status(400).send('Category already exists.');

        category = new Category({ name, description });
        await category.save();

        res.status(201).send(category);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// List all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.send(categories);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
