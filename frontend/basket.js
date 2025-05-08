document.addEventListener('DOMContentLoaded', function () {
    const basketItemsContainer = document.querySelector('.books-container');
    const totalPriceElement = document.getElementById('total-price');
    let cart = [];

    const checkoutBtn = document.querySelector('.button'); // кнопка оформлення

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Відображення товарів у кошику
    function displayBasketItems() {
        if (!basketItemsContainer) {
            console.error("Element with class 'books-container' not found.");
            return;
        }

        basketItemsContainer.innerHTML = '';
        let total = 0;

        if (!cart.length) {
            basketItemsContainer.innerHTML = '<p>Ваш кошик порожній.</p>';
            totalPriceElement.textContent = '0₴';
            return;
        }

        cart.forEach((book, index) => {
            const quantity = book.quantity || 1;
            const priceNumber = parseFloat(book.price.replace('₴', '').trim()) || 0;
            const itemTotal = priceNumber * quantity;
            total += itemTotal;

            const basketItem = document.createElement('div');
            basketItem.classList.add('book-card');
            basketItem.innerHTML = `
                <img src="${book.img}" alt="${book.title}">
                <div class="book-info">
                    <p class="book-title">${book.title}</p>
                    <p class="book-author">${book.author}</p>
                    <span class="book-price">${book.price} × ${quantity} = ${itemTotal.toFixed(2)}₴</span>
                </div>
                <div class="quantity-control">
                    <button class="decrease-qty" data-index="${index}">–</button>
                    <span class="book-qty">${quantity}</span>
                    <button class="increase-qty" data-index="${index}">+</button>
                    <button class="remove-from-basket cart-btn" data-index="${index}">Видалити</button>
                </div>
            `;
            basketItemsContainer.appendChild(basketItem);
        });

        totalPriceElement.textContent = `${total.toFixed(2)}₴`;
        attachActionListeners();
    }

    // Прикріплення обробників подій
    function attachActionListeners() {
        document.querySelectorAll('.remove-from-basket').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                if (!isNaN(index)) {
                    removeItem(index);
                }
            });
        });

        document.querySelectorAll('.increase-qty').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                if (!isNaN(index) && cart[index]) {
                    cart[index].quantity = (cart[index].quantity || 1) + 1;
                    updateItemQuantity(index, cart[index].quantity);
                    updateCart();
                }
            });
        });

        document.querySelectorAll('.decrease-qty').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                if (!isNaN(index) && cart[index]) {
                    if ((cart[index].quantity || 1) > 1) {
                        cart[index].quantity -= 1;
                        updateItemQuantity(index, cart[index].quantity);
                    } else {
                        removeItem(index);
                    }
                    updateCart();
                }
            });
        });
    }

    // Оновлення кошика у localStorage і на сервері
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        displayBasketItems();
        syncCartWithServer();
    }

    // Надсилання кошика на сервер
    function syncCartWithServer() {
        fetch('http://localhost:5000/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cart)
        })
        .then(response => {
            if (!response.ok) throw new Error('Помилка оновлення на сервері');
            return response.json();
        })
        .then(data => {
            console.log('Кошик оновлено на сервері:', data);
        })
        .catch(error => {
            console.error('Помилка синхронізації кошика:', error);
        });
    }

    // Початкове завантаження кошика з сервера
    fetch('http://localhost:5000/cart')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Помилка завантаження кошика: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cart = Array.isArray(data) ? data : [];
            localStorage.setItem('cart', JSON.stringify(cart));
            displayBasketItems();
        })
        .catch(error => {
            console.error('Помилка завантаження кошика:', error);
            if (basketItemsContainer) {
                basketItemsContainer.innerHTML = '<p>Помилка завантаження кошика.</p>';
            }
        });

    // Оновлення кількості книги
    function updateItemQuantity(index, quantity) {
        const item = cart[index];
        fetch(`http://localhost:5000/cart`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: item.title, quantity: quantity })
        })
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error(error));
    }

    // Видалення книги з кошика
    function removeItem(index) {
        const item = cart[index];
        fetch(`http://localhost:5000/cart`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: item.title })
        })
        .then(response => response.json())
        .then(data => {
            cart.splice(index, 1); // Видаляємо товар з localStorage
            updateCart(); // Оновлюємо кошик
        })
        .catch(error => console.error(error));
    }
});

function handleCheckout() {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (!isLoggedIn) {
        alert("Щоб оформити замовлення, увійдіть або зареєструйтесь.");
        openModal("login"); // відкриває форму входу
    } else {
        // Тут логіка оформлення замовлення
        alert("Замовлення успішно оформлено!");
    }
}