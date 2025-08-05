const products = [
    { name: 'mazapan', price: 4, code: '2414200880' },
    { name: 'Pan Bimbo', price: 35, code: '7501000100102' },
    { name: 'Leche', price: 25, code: '7501026000901' },
    { name: 'Huevo', price: 45, code: '1234567890123' }
];

let cart = [];

const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const totalDisplay = document.getElementById('total');
const cashInput = document.getElementById('cash');
const changeDisplay = document.getElementById('change');
const chargeButton = document.getElementById('charge');
const scanBtn = document.getElementById('scan-btn');
const reader = document.getElementById('reader');

// Mostrar productos
products.forEach((product, index) => {
    const div = document.createElement('div');
    div.className = 'product';
    div.textContent = `${product.name} - $${product.price}`;
    div.onclick = () => addToCart(products[index]);
    productList.appendChild(div);
});

function addToCart(product) {
    cart.push(product);
    renderCart();
}

function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price}`;
        cartItems.appendChild(li);
    });
    totalDisplay.textContent = total.toFixed(2); // Asegura que el total se muestre con 2 decimales
    validatePayment(total);
}

function validatePayment(total) {
    cashInput.oninput = () => {
        const cash = parseFloat(cashInput.value) || 0;
        if (cash >= total && total > 0) {
            chargeButton.disabled = false;
            changeDisplay.textContent = (cash - total).toFixed(2);
        } else {
            chargeButton.disabled = true;
            changeDisplay.textContent = '0.00';
        }
    };
}

chargeButton.onclick = () => {
    alert('Venta realizada con éxito');
    cart = [];
    renderCart();
    cashInput.value = '';
    changeDisplay.textContent = '0.00';
    chargeButton.disabled = true;
};

// Escáner
let html5QrCode;
scanBtn.onclick = () => {
    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }
    html5QrCode.start(
        { facingMode: "environment" }, // Usa cámara trasera
        { fps: 10, qrbox: 250 },
        code => {
            const product = products.find(p => p.code === code);
            if (product) {
                addToCart(product);
                alert(`Producto agregado: ${product.name}`);
            } else {
                alert("Código no registrado");
            }
            html5QrCode.stop();
        },
        error => {
            console.error(error);
        }
    ).catch(err => console.error(err));
};