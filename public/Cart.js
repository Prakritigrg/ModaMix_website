document.addEventListener('DOMContentLoaded', function () {
    const userId = '6686e2c062afef5f217c46c1'; // Replace with actual user ID from your database
    const cartUrl = `/api/cart/${userId}`;

    // Fetch cart
    async function fetchCart() {
        try {
            const response = await fetch(cartUrl);
            const cart = await response.json();
            if (response.ok) {
                renderCart(cart);
            } else {
                console.error('Error fetching cart:', cart.message);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }

    // Render cart
    function renderCart(cart) {
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';
        if (cart.items && cart.items.length > 0) {
            cart.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.innerHTML = `
                    <div>
                        <h4>${item.productId.name}</h4>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: <input type="number" value="${item.quantity}" data-product-id="${item.productId._id}" class="update-quantity"></p>
                        <p>Total: ${item.total}</p>
                        <button data-product-id="${item.productId._id}" class="remove-item">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        } else {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        }
        document.getElementById('cart-total').innerText = `Total: ${cart.cartTotal}`;
    }

    // Show message
    function showMessage(message, type = 'success') {
        const messageContainer = document.getElementById('message');
        messageContainer.innerText = message;
        messageContainer.className = type;
        setTimeout(() => {
            messageContainer.innerText = '';
            messageContainer.className = '';
        }, 3000);
    }

    // Add item to cart
    document.getElementById('add-to-cart').addEventListener('submit', async function (e) {
        e.preventDefault();
        const productId = document.getElementById('product-id').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId, quantity })
            });
            if (response.ok) {
                showMessage('Item added to cart successfully!');
                fetchCart();
            } else {
                showMessage('Failed to add item to cart', 'error');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            showMessage('Failed to add item to cart', 'error');
        }
    });

    // Update item quantity
    document.getElementById('cart-items').addEventListener('input', async function (e) {
        if (e.target.classList.contains('update-quantity')) {
            const productId = e.target.dataset.productId;
            const quantity = parseInt(e.target.value);
            try {
                const response = await fetch('/api/cart/update', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, productId, quantity })
                });
                if (response.ok) {
                    showMessage('Item quantity updated successfully!');
                    fetchCart();
                } else {
                    showMessage('Failed to update item quantity', 'error');
                }
            } catch (error) {
                console.error('Error updating item quantity:', error);
                showMessage('Failed to update item quantity', 'error');
            }
        }
    });

    // Remove item from cart
    document.getElementById('cart-items').addEventListener('click', async function (e) {
        if (e.target.classList.contains('remove-item')) {
            const productId = e.target.dataset.productId;
            try {
                const response = await fetch('/api/cart/remove', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, productId })
                });
                if (response.ok) {
                    showMessage('Item removed from cart successfully!');
                    fetchCart();
                } else {
                    showMessage('Failed to remove item from cart', 'error');
                }
            } catch (error) {
                console.error('Error removing item from cart:', error);
                showMessage('Failed to remove item from cart', 'error');
            }
        }
    });

    // Initial fetch
    fetchCart();
});
