// ===============================
// PRODUCTOS
// ===============================

const products = [

    {
        id: 1,
        name: "Nude Minimal",
        price: 12500,
        category: "minimalista",
        color: "#d9c4b5",
        description: "Minimalista"
    },

    {
        id: 2,
        name: "Pink Flower",
        price: 18000,
        category: "floral",
        color: "#e8b8c2",
        description: "Flores"
    },

    {
        id: 3,
        name: "Cherry Cute",
        price: 15500,
        category: "cute",
        color: "#c95c64",
        description: "Cherry ♡"
    },

    {
        id: 4,
        name: "Clear Classic",
        price: 11000,
        category: "transparente",
        color: "#e8e5df",
        description: "Clear"
    },

    {
        id: 5,
        name: "Coffee Mood",
        price: 17500,
        category: "minimalista",
        color: "#a98b78",
        description: "Coffee"
    },

    {
        id: 6,
        name: "Butterfly",
        price: 22000,
        category: "cute",
        color: "#c9b5d9",
        description: "Butterfly"
    },

    {
        id: 7,
        name: "Wild Flower",
        price: 19500,
        category: "floral",
        color: "#a9b99b",
        description: "Wild flowers"
    },

    {
        id: 8,
        name: "Clear Pink",
        price: 14000,
        category: "transparente",
        color: "#f0ccd2",
        description: "Pink clear"
    }

];


// ===============================
// VARIABLES
// ===============================

let cart = JSON.parse(localStorage.getItem("caselyCart")) || [];

let favorites = JSON.parse(localStorage.getItem("caselyFavorites")) || [];


// ===============================
// ELEMENTOS
// ===============================

const productsContainer = document.getElementById("productsContainer");

const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");

const priceFilter = document.getElementById("priceFilter");

const cartPanel = document.getElementById("cartPanel");

const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");

const cartCount = document.getElementById("cartCount");

const overlay = document.getElementById("overlay");

const message = document.getElementById("message");


// ===============================
// MOSTRAR PRODUCTOS
// ===============================

function displayProducts() {

    const search = searchInput.value.toLowerCase();

    const category = categoryFilter.value;

    const price = priceFilter.value;


    let filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(search);

        const matchesCategory =
            category === "todos" ||
            product.category === category;

        let matchesPrice = true;


        if (price === "low") {
            matchesPrice = product.price <= 15000;
        }

        if (price === "medium") {
            matchesPrice =
                product.price > 15000 &&
                product.price <= 20000;
        }

        if (price === "high") {
            matchesPrice = product.price > 20000;
        }


        return matchesSearch &&
               matchesCategory &&
               matchesPrice;

    });


    productsContainer.innerHTML = "";


    if (filteredProducts.length === 0) {

        productsContainer.innerHTML = `
            <p style="grid-column: 1/-1; text-align:center;">
                No encontramos fundas con esa búsqueda ♡
            </p>
        `;

        return;
    }


    filteredProducts.forEach(product => {

        const isFavorite = favorites.includes(product.id);

        const card = document.createElement("article");

        card.classList.add("product-card");


        card.innerHTML = `

            <div class="product-image"
                 style="background:${product.color}">

                <button
                    class="favorite"
                    onclick="toggleFavorite(${product.id})">
                    ${isFavorite ? "♥" : "♡"}
                </button>

                <div class="case-shape"
                     style="background:${product.color}">
                    ${product.description}
                </div>

            </div>


            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="category">
                    ${capitalize(product.category)}
                </p>

                <p class="price">
                    $${product.price.toLocaleString("es-AR")}
                </p>

                <button
                    class="add-btn"
                    onclick="addToCart(${product.id})">
                    Agregar al carrito
                </button>

            </div>

        `;


        productsContainer.appendChild(card);

    });

}


// ===============================
// AGREGAR AL CARRITO
// ===============================

function addToCart(id) {

    const existingProduct =
        cart.find(item => item.id === id);


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }


    saveCart();

    updateCart();

    showMessage("¡Funda agregada al carrito! ♡");

}


// ===============================
// ACTUALIZAR CARRITO
// ===============================

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;

    let count = 0;


    cart.forEach(item => {

        const product =
            products.find(p => p.id === item.id);


        if (!product) return;


        total += product.price * item.quantity;

        count += item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.classList.add("cart-item");


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h4>${product.name}</h4>

                <p>
                    $${product.price.toLocaleString("es-AR")}
                </p>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(${product.id}, -1)">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        onclick="changeQuantity(${product.id}, 1)">
                        +
                    </button>

                </div>

            </div>


            <button
                class="remove"
                onclick="removeFromCart(${product.id})">
                🗑️
            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p style="text-align:center; padding:40px 0;">
                Tu carrito está vacío ♡
            </p>
        `;

    }


    cartTotal.textContent =
        "$" + total.toLocaleString("es-AR");


    cartCount.textContent = count;

}


// ===============================
// CAMBIAR CANTIDAD
// ===============================

function changeQuantity(id, amount) {

    const item =
        cart.find(item => item.id === id);


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(item => item.id !== id);

    }


    saveCart();

    updateCart();

}


// ===============================
// ELIMINAR PRODUCTO
// ===============================

function removeFromCart(id) {

    cart =
        cart.filter(item => item.id !== id);


    saveCart();

    updateCart();

    showMessage("Producto eliminado del carrito.");

}


// ===============================
// FAVORITOS
// ===============================

function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(item => item !== id);

        showMessage("Eliminado de favoritos.");

    } else {

        favorites.push(id);

        showMessage("Agregado a favoritos ♡");

    }


    localStorage.setItem(
        "caselyFavorites",
        JSON.stringify(favorites)
    );


    displayProducts();

}


// ===============================
// GUARDAR CARRITO
// ===============================

function saveCart() {

    localStorage.setItem(
        "caselyCart",
        JSON.stringify(cart)
    );

}


// ===============================
// ABRIR CARRITO
// ===============================

document.getElementById("cartBtn")
    .addEventListener("click", () => {

        cartPanel.classList.add("active");

        overlay.classList.add("active");

    });


// ===============================
// CERRAR CARRITO
// ===============================

document.getElementById("closeCart")
    .addEventListener("click", closeCart);


overlay.addEventListener("click", closeCart);


function closeCart() {

    cartPanel.classList.remove("active");

    overlay.classList.remove("active");

}


// ===============================
// BUSCADOR Y FILTROS
// ===============================

searchInput.addEventListener(
    "input",
    displayProducts
);

categoryFilter.addEventListener(
    "change",
    displayProducts
);

priceFilter.addEventListener(
    "change",
    displayProducts
);


// ===============================
// MODO OSCURO
// ===============================

const darkModeBtn =
    document.getElementById("darkModeBtn");


darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        darkModeBtn.textContent = "☀️";

        localStorage.setItem(
            "caselyDarkMode",
            "true"
        );

    } else {

        darkModeBtn.textContent = "🌙";

        localStorage.setItem(
            "caselyDarkMode",
            "false"
        );

    }

});


if (
    localStorage.getItem("caselyDarkMode") === "true"
) {

    document.body.classList.add("dark");

    darkModeBtn.textContent = "☀️";

}


// ===============================
// FINALIZAR COMPRA
// ===============================

document.getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (cart.length === 0) {

            showMessage("Tu carrito está vacío.");

            return;

        }


        showMessage(
            "¡Compra realizada con éxito! Gracias por elegir CASELY ♡"
        );


        cart = [];

        saveCart();

        updateCart();

        closeCart();

    });


// ===============================
// MENSAJES
// ===============================

function showMessage(text) {

    message.textContent = text;

    message.classList.add("show");


    setTimeout(() => {

        message.classList.remove("show");

    }, 2500);

}


// ===============================
// FUNCIONES AUXILIARES
// ===============================

function capitalize(text) {

    return text.charAt(0).toUpperCase() +
           text.slice(1);

}


// ===============================
// INICIAR PÁGINA
// ===============================

displayProducts();

updateCart();
