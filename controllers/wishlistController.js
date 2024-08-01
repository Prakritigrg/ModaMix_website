const Wishlist = require('../models/wishlistModel');

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Check if the item already exists in the wishlist
        const existingItem = await Wishlist.findOne({ userId, productId });
        if (existingItem) {
            return res.status(400).json({ message: 'Item already in wishlist' });
        }

        const newItem = new Wishlist({ userId, productId });
        await newItem.save();

        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add item to wishlist', error });
    }
};

// Get wishlist items for a user
exports.getWishlistItems = async (req, res) => {
    try {
        const { userId } = req.params;
        const items = await Wishlist.find({ userId }).populate('productId');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch wishlist items', error });
    }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        await Wishlist.findByIdAndDelete(id);
        res.status(200).json({ message: 'Item removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove item from wishlist', error });
    }
};
