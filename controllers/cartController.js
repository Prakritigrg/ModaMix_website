const Cart = require('../models/cartModel');
const Product = require('../models/Product');

// Add item to cart
exports.addItemToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        const cart = await Cart.findOne({ userId });
        const itemTotal = product.price * quantity;

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                let item = cart.items[itemIndex];
                item.quantity += quantity;
                item.total = item.quantity * product.price;
                cart.items[itemIndex] = item;
            } else {
                cart.items.push({
                    productId,
                    quantity,
                    price: product.price,
                    total: itemTotal
                });
            }
            cart.cartTotal = cart.items.reduce((acc, item) => acc + item.total, 0);
            await cart.save();
        } else {
            const newCart = new Cart({
                userId,
                items: [{
                    productId,
                    quantity,
                    price: product.price,
                    total: itemTotal
                }],
                cartTotal: itemTotal
            });
            await newCart.save();
        }
        res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update item quantity
exports.updateItemQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        let item = cart.items[itemIndex];
        item.quantity = quantity;
        item.total = item.quantity * item.price;
        cart.items[itemIndex] = item;
        cart.cartTotal = cart.items.reduce((acc, item) => acc + item.total, 0);

        await cart.save();
        res.status(200).json({ message: 'Item quantity updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.cartTotal = cart.items.reduce((acc, item) => acc + item.total, 0);

        await cart.save();
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get cart
exports.getCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price');
        if (!cart) {
            return res.status(200).json({ items: [], cartTotal: 0 });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
};



