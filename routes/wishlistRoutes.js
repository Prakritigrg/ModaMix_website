const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// Add item to wishlist
router.post('/add', wishlistController.addToWishlist);

// Get all wishlist items for a user
router.get('/:userId', wishlistController.getWishlistItems);

// Remove item from wishlist
router.delete('/remove/:id', wishlistController.removeFromWishlist);

module.exports = router;
