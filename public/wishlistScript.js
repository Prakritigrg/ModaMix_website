document.addEventListener('DOMContentLoaded', async function() {
    try {
        const userId = getUserId();

        const response = await fetch(`/api/wishlist/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch wishlist items');
        }
        const wishlistItems = await response.json();

        const wishlistItemsContainer = document.getElementById('wishlistItems');
        wishlistItems.forEach(item => {
            const itemElement = createWishlistItemElement(item);
            wishlistItemsContainer.appendChild(itemElement);
        });
    } catch (error) {
        console.error('Error fetching wishlist items:', error);
    }

    document.getElementById('addToWishlistForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const productId = document.getElementById('productId').value;

        try {
            const userId = getUserId();

            const response = await fetch('/api/wishlist/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, productId })
            });

            if (!response.ok) {
                throw new Error('Failed to add item to wishlist');
            }

            const newItem = await response.json();
            const itemElement = createWishlistItemElement(newItem);
            wishlistItemsContainer.appendChild(itemElement);

            // Show success message
            showMessage('Item added to wishlist successfully');
        } catch (error) {
            console.error('Error adding item to wishlist:', error);
        }
    });
});

function getUserId() {
    // Implement logic to retrieve userId from session or localStorage
    // Example: return sessionStorage.getItem('userId'); or localStorage.getItem('userId');
    return '60e1a627aeb7e6f205e2ab5f'; // Example userId, replace with your actual logic
}

function createWishlistItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.setAttribute('data-id', item._id);
    itemElement.innerHTML = `
        <p>Product: ${item.productId.name}</p>
        <button onclick="removeWishlistItem('${item._id}')">Remove</button>
    `;
    return itemElement;
}

async function removeWishlistItem(itemId) {
    if (confirm('Are you sure you want to remove this item?')) {
        try {
            const response = await fetch(`/api/wishlist/remove/${itemId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const wishlistItemElement = document.querySelector(`#wishlistItems div[data-id="${itemId}"]`);
                if (wishlistItemElement) {
                    wishlistItemElement.remove();
                }
            } else {
                throw new Error('Failed to remove wishlist item');
            }
        } catch (error) {
            console.error('Error removing wishlist item:', error);
        }
    }
}

function showMessage(message) {
    // Example implementation: show a Bootstrap alert or any other UI element
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.display = 'block';

    // Optional: Hide the message after a few seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000); // Hide after 3 seconds
}
