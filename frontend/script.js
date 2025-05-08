document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.querySelector('input[name="search"]');
    const randomWords = [
        ' драма..',
        ' пригоди...',
        ' фентазі...',
        ' детектив...',
        ' класика...',
        ' трилер...',
    ];

    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * randomWords.length);
        return randomWords[randomIndex];
    }

    searchInput.value = getRandomWord();

    let booksData = [];

    fetch("http://localhost:5000/books")
        .then(res => res.json())
        .then(data => {
            booksData = data;
            displayBooks(); 
        });
    
//http://127.0.0.1:5000/cart
//http://127.0.0.1:5000/books

    const categories = [
        { name: "Всі книги", filter: "all"},
        { name: "Новинки", filter: "new" },
        { name: "Хіт продаж", filter: "bestseller" },
        { name: "Фентазі", filter: "fantasy", rating: "2" },
        { name: "Детектив", filter: "detective", rating: "4" },
        { name: "Драма", filter: "drama", rating: "3" },
        { name: "Пригоди", filter: "adventures", rating: "3" },
        { name: "Класика", filter: "classic", rating: "2" },
        { name: "Трилер", filter: "thriller", rating: "5" }
    ];

    const booksContainer = document.getElementById("bookcontainer");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const filterContainer = document.getElementById("filter-container");
    const sidebar = document.getElementById("sidebar");
    const priceSlider = document.getElementById('priceRange');  
    const priceValue = document.getElementById('priceValue');  
    let openButton = null;
    let booksLoaded = 0;
    const booksPerLoad = 3;
    let maxPrice = Infinity;
    
    // Генерація фільтрів
    if (filterContainer) {
        categories.forEach(category => {
            const button = document.createElement('button');
            button.classList.add('filter-btn');
            button.setAttribute('data-filter', category.filter);
            button.textContent = category.name;
    
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                displayBooks(category.filter);
            });
    
            filterContainer.appendChild(button);
        });
    }

        // Робимо першу кнопку активною
        const allBooksButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBooksButton) {
            allBooksButton.classList.add('active');
            displayBooks('all');
        }

    // Функція побудови графіка
    let doughnutChart, barChart, radarChart;

function createChart() {
    const filteredCategories = categories.filter(category =>
        category.filter !== "all" &&
        category.filter !== "new" &&
        category.filter !== "bestseller"
    );

    const sortedCategories = filteredCategories.sort((a, b) => parseInt(b.rating) - parseInt(a.rating));
    const xValues = sortedCategories.map(category => category.name);
    const yValues = sortedCategories.map(category => parseInt(category.rating));
    const barColors = [
        "#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145", "#ff9900", "#9900cc"
    ];

    // Doughnut
    const doughnutCtx = document.getElementById("myChartDoughnut").getContext("2d");
    doughnutChart = new Chart(doughnutCtx, {
        type: "doughnut",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            title: {
                display: true,
                text: "Doughnut: Рейтинг жанрів"
            }
        }
    });

    // Bar
    const barCtx = document.getElementById("myChartBar").getContext("2d");
    barChart = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                label: "Рейтинг",
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            title: {
                display: true,
                text: "Bar: Рейтинг жанрів"
            }
        }
    });

    // Radar
    const radarCtx = document.getElementById("myChartRadar").getContext("2d");
    radarChart = new Chart(radarCtx, {
        type: "radar",
        data: {
            labels: xValues,
            datasets: [{
                label: "Рейтинг",
                backgroundColor: "rgba(0,123,255,0.2)",
                borderColor: "rgba(0,123,255,1)",
                pointBackgroundColor: "rgba(0,123,255,1)",
                data: yValues
            }]
        },
        options: {
            title: {
                display: true,
                text: "Radar: Рейтинг жанрів"
            },
            scale: {
                ticks: {
                    beginAtZero: true
                }
            }
        }
    });
}
    
    // Функція оновлення графіка
    function updateChart() {
        if (doughnutChart) doughnutChart.destroy();
        if (barChart) barChart.destroy();
        if (radarChart) radarChart.destroy();
        createChart();
    }
    
    createChart();
    
    // Відображення книг
    function displayBooks(filter = "all") {
        const filteredBooks = booksData.filter(book =>
            (filter === "all" || book.category.includes(filter)) &&
            parseFloat(book.price) <= maxPrice
        );
    
        booksLoaded = 0;
        booksContainer.innerHTML = '';
    
        filteredBooks.slice(0, booksPerLoad).forEach(book => {
            createBookCard(book);
            booksLoaded++;
        });
    
        loadMoreBtn.style.display = (filteredBooks.length > booksPerLoad) ? "inline-block" : "none";
    }
    
    // Створення картки книги
    function createBookCard(book) {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
    
        bookCard.innerHTML = `
            <img src="${book.img}" alt="Book Cover">
            <div class="book-info">
                <p class="book-title">${book.title}</p>
                <p class="book-author">${book.author}</p>
                <span class="book-price">${book.price}</span>
            </div>
        `;
    
        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("book-actions");
        console.log("Книгу додано:", book.title);
        console.log("Роль користувача:", localStorage.getItem('userRole'));
        // Кнопка "у кошик"
        const cartBtn = document.createElement("button");
        cartBtn.classList.add("cart-btn");
        cartBtn.innerHTML = '<img src="images/cart.svg" alt="Cart" />';
        cartBtn.addEventListener("click", function () {
            const bookToAdd = {
                title: book.title,
                author: book.author,
                price: book.price,
                img: book.img,
                quantity: 1
            };
    
            let cart = localStorage.getItem('cart');
            cart = cart ? JSON.parse(cart) : [];
    
            const existingBook = cart.find(item => item.title === bookToAdd.title);
    
            if (existingBook) {
                existingBook.quantity += 1;
                alert(`Кількість книги "${bookToAdd.title}" у кошику збільшено.`);
            } else {
                cart.push(bookToAdd);
                alert(`Книга "${bookToAdd.title}" додана до кошика!`);
            }
    
            localStorage.setItem('cart', JSON.stringify(cart));
    
            fetch("http://localhost:5000/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookToAdd)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Помилка сервера при додаванні до кошика");
                }
                return response.json();
            })
            .then(data => {
                console.log("Успішно:", data.message);
                alert("Книга додана до кошика на сервері!");
            })
            .catch(error => {
                console.error("Помилка:", error);
                alert("Не вдалося додати книгу до кошика.");
            });
    
            if (Array.isArray(book.category)) {
                book.category.forEach(catFilter => {
                    const categoryObj = categories.find(cat => cat.filter === catFilter);
                    if (categoryObj) {
                        categoryObj.rating = parseInt(categoryObj.rating) + 1;
                    }
                });
            } else {
                const categoryObj = categories.find(cat => cat.filter === book.category);
                if (categoryObj) {
                    categoryObj.rating = parseInt(categoryObj.rating) + 1;
                }
            }
    
            updateChart(); 
        });
    
        // Кнопка "деталі"
        const detailsBtn = document.createElement("button");
        detailsBtn.classList.add("details-btn");
        detailsBtn.innerHTML = '<img src="images/arrow.svg" alt="Details" />';
        detailsBtn.addEventListener("click", function () {
            const isSidebarOpen = sidebar.classList.contains("open");
            const isSameButton = this === openButton;
    
            if (isSidebarOpen && isSameButton) {
                closeSidebar();
                openButton = null;
            } else {
                openSidebar(book.title, book.author, book.price, book.img, book.description);
                openButton = this;
            }
        });
    
// Додаємо функцію перевірки адміністратора
function isAdmin() {
    const userRole = localStorage.getItem('userRole'); 
    return userRole === 'admin'; 
}

if (isAdmin()) {
    console.log("Користувач є адміністратором, кнопки редагування та видалення додаються");

   // Кнопка "Редагувати"
const editBtn = document.createElement("button");
editBtn.classList.add("edit-product-btn");
editBtn.textContent = "Редагувати";
editBtn.addEventListener("click", () => {
    console.log("Кнопка редагування натиснута для книги:", book.title);
    openEditModal(book, bookCard);
});

// Кнопка "Видалити"
const deleteBtn = document.createElement("button");
deleteBtn.classList.add("delete-product-btn");
deleteBtn.textContent = "Видалити";
deleteBtn.addEventListener("click", () => {
    if (confirm(`Ви впевнені, що хочете видалити "${book.title}"?`)) {
        bookCard.remove();

        let books = JSON.parse(localStorage.getItem("books")) || [];
        books = books.filter(b => b.title !== book.title);
        localStorage.setItem("books", JSON.stringify(books));

        alert(`Книгу "${book.title}" видалено.`);
    }
});
    buttonsContainer.appendChild(editBtn);
    buttonsContainer.appendChild(deleteBtn);
}


buttonsContainer.appendChild(cartBtn);
buttonsContainer.appendChild(detailsBtn);

bookCard.appendChild(buttonsContainer);
booksContainer.appendChild(bookCard);
}
    
    function closeEditModal() {
        const modal = document.getElementById("edit-modal");
        if (modal) modal.remove();
    } 
    
    // Load more
if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
        const activeFilter = document.querySelector(".filter-btn.active").getAttribute("data-filter");
        const filteredBooks = booksData.filter(book =>
            (activeFilter === "all" || book.category.includes(activeFilter)) &&
            parseFloat(book.price) <= maxPrice
        );

        const newBooksToLoad = filteredBooks.slice(booksLoaded, booksLoaded + booksPerLoad);
        newBooksToLoad.forEach(book => {
            createBookCard(book);
            booksLoaded++;
        });

        if (booksLoaded >= filteredBooks.length) {
            loadMoreBtn.style.display = "none";
        }
    });
}
    // Фільтр ціни
    if (priceSlider && priceValue) {
        priceValue.textContent = `${priceSlider.value} грн`;
    
        priceSlider.addEventListener("input", () => {
            maxPrice = parseFloat(priceSlider.value);
            priceValue.textContent = `${maxPrice} грн`;
    
            const activeFilter = document.querySelector(".filter-btn.active")?.getAttribute("data-filter") || "all";
            displayBooks(activeFilter);
        });
    }
    
    displayBooks();

    const popup = document.getElementById("popup-ad");
    const closeBtn = document.querySelector(".close-btn");
    const claimOfferBtn = document.getElementById("claim-offer");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => popup.style.display = "none");
    }

    if (claimOfferBtn) {
        claimOfferBtn.addEventListener("click", () => {
            alert("🎉 Ваша знижка активована! Використовуйте код: BOOK20");
            popup.style.display = "none";
        });
    }
});

function closePopup() {
    const popup = document.getElementById("popup-ad");
    popup.style.display = "none";  
}

function openSidebar(title, author, price, img, description) {
    const sidebar = document.getElementById("sidebar");

    document.getElementById("sidebar-title").textContent = title;
    document.getElementById("sidebar-author").textContent = "Автор: " + author;
    document.getElementById("sidebar-price").textContent = "Ціна: " + price;
    document.getElementById("sidebar-img").src = img;
    document.getElementById("sidebar-description").textContent = description;
    sidebar.classList.add("open");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
}

const charts = document.querySelectorAll('.small-chart');

charts.forEach(chart => {
    chart.addEventListener('mouseenter', () => {
        chart.style.opacity = '1'; 
    });
    
    chart.addEventListener('mouseleave', () => {
        chart.style.opacity = '0'; 
    });
});

function openEditModal(book, bookCard) {
    console.log("Відкриваю модальне вікно для книги:", book.title);

    const existingModal = document.getElementById("book-edit-modal");
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', `
        <div id="book-edit-modal" class="modal">
            <div class="modal-content">
                <span id="close-modal" class="modal-close">&times;</span>
                <h2>Редагувати книгу</h2>
                <form id="edit-book-form">
                    <label>Назва:</label>
                    <input type="text" name="title" required value="${book.title}"><br>
                    <label>Автор:</label>
                    <input type="text" name="author" required value="${book.author}"><br>
                    <label>Ціна:</label>
                    <input type="number" name="price" required value="${book.price}"><br>
                    <label>Опис:</label>
                    <textarea name="description" required>${book.description}</textarea><br>
                    <button type="submit">Зберегти</button>
                </form>
            </div>
        </div>
    `);

    const modal = document.getElementById("book-edit-modal");
    modal.style.display = "block";

    document.getElementById("close-modal").addEventListener("click", closeEditModal);

    document.getElementById("edit-book-form").addEventListener("submit", function (e) {
        e.preventDefault();  

        const updatedBook = {
            ...book,
            title: e.target.title.value,
            author: e.target.author.value,
            price: e.target.price.value,
            description: e.target.description.value
        };

        let books = JSON.parse(localStorage.getItem("books")) || [];
        books = books.map(b => b.title === book.title ? updatedBook : b);
        localStorage.setItem("books", JSON.stringify(books));

        bookCard.querySelector(".book-title").textContent = updatedBook.title;
        bookCard.querySelector(".book-author").textContent = updatedBook.author;
        bookCard.querySelector(".book-price").textContent = updatedBook.price;

        closeEditModal();
        alert("Зміни успішно збережено!");
    });
}

// Закриття модального вікна
function closeEditModal() {
    const modal = document.getElementById("book-edit-modal");
    if (modal) {
        modal.style.display = "none";  
        modal.remove(); 
    }
}



