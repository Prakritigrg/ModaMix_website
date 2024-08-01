const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// Create a new product
router.post('/products', async (req, res) => {
    const { name, description, price, categoryId } = req.body;

    try {
        const category = await Category.findById(categoryId);
        if (!category) return res.status(400).send('Category not found.');

        const product = new Product({ name, description, price, category: categoryId });
        await product.save();

        res.status(201).send(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// List all products under a specific category
router.get('/products/:categoryId', async (req, res) => {
    const { categoryId } = req.params;

    try {
        const products = await Product.find({ category: categoryId }).populate('category');
        res.send(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
