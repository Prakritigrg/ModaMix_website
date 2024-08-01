// User Registration Form
document.getElementById('registerForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById('userMessage').innerText = 'User registered successfully!';
    } else {
        document.getElementById('userMessage').innerText = `Error: ${result.message || 'Unknown error'}`;
    }
});

// Category Creation Form
document.getElementById('categoryForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('categoryName').value;
    const description = document.getElementById('categoryDesc').value;

    try {
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description })
        });

        if (!response.ok) {
            throw new Error('Failed to create category');
        }

        const result = await response.json();
        console.log('Category created:', result);
        document.getElementById('categoryMessage').innerText = 'Category created successfully!';
    } catch (error) {
        console.error('Error creating category:', error);
        document.getElementById('categoryMessage').innerText = 'Error creating category: ' + error.message;
    }
});

// Product Creation Form
document.getElementById('productForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDesc').value;
    const price = document.getElementById('productPrice').value;
    const categoryId = document.getElementById('productCategory').value;

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price, categoryId })
        });

        if (!response.ok) {
            throw new Error('Failed to create product');
        }

        const result = await response.json();
        console.log('Product created:', result);
        document.getElementById('productMessage').innerText = 'Product created successfully!';
    } catch (error) {
        console.error('Error creating product:', error);
        document.getElementById('productMessage').innerText = 'Error creating product: ' + error.message;
    }
});

// Populate category dropdown in product form
document.addEventListener('DOMContentLoaded', async function() {
    const categorySelect = document.getElementById('productCategory');
    if (categorySelect) {
        try {
            const response = await fetch('/api/categories');
            const categories = await response.json();

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category._id;
                option.text = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
});

// Shopping Cart Functions

// Add to cart
async function addToCart(productId, quantity) {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });

        if (!response.ok) {
            throw new Error('Failed to add product to cart');
        }

        const cart = await response.json();
        console.log('Product added to cart:', cart);
        // Update cart display or notify user here
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
}

// Update cart item quantity
async function updateCartItem(itemId, quantity) {
    try {
        const response = await fetch(`/api/cart/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });

        if (!response.ok) {
            throw new Error('Failed to update cart item');
        }

        const cart = await response.json();
        console.log('Cart item updated:', cart);
        // Update cart display or notify user here
    } catch (error) {
        console.error('Error updating cart item:', error);
    }
}

// Remove item from cart
async function removeFromCart(itemId) {
    try {
        const response = await fetch(`/api/cart/${itemId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to remove item from cart');
        }

        const cart = await response.json();
        console.log('Item removed from cart:', cart);
        // Update cart display or notify user here
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
}

// Get cart
async function getCart() {
    try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }

        const cart = await response.json();
        console.log('Cart:', cart);
        // Display cart details here
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

// Event listeners for cart actions
document.getElementById('addToCartForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const productId = document.getElementById('productId').value;
    const quantity = document.getElementById('quantity').value;
    await addToCart(productId, quantity);
});

document.getElementById('updateCartItemForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const itemId = document.getElementById('itemId').value;
    const quantity = document.getElementById('itemQuantity').value;
    await updateCartItem(itemId, quantity);
});

document.getElementById('removeCartItemForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const itemId = document.getElementById('removeItemId').value;
    await removeFromCart(itemId);
});
document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display cart items
    getCart();
});

// Fetch the user's cart
async function getCart() {
    try {
        const response = await fetch('/api/cart');
        if (response.ok) {
            const cart = await response.json();
            displayCart(cart);
        } else {
            console.error('Failed to fetch cart');
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

// Display the cart items
function displayCart(cart) {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    cart.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.product.name} - ${item.quantity} x ${item.price} = ${item.amount}`;
        cartItems.appendChild(li);
    });

    const totalAmount = document.createElement('div');
    totalAmount.textContent = `Total: ${cart.totalAmount}`;
    cartItems.appendChild(totalAmount);
}

// Add product to cart
async function addToCart(productId, quantity) {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });

        if (response.ok) {
            const cart = await response.json();
            displayCart(cart);
        } else {
            console.error('Failed to add to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

