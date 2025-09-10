import { products } from "./products.js";

export let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ذخیره در localStorage
export function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// محاسبه جمع
export function calculateTotal() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.09);
  const shipping = subtotal > 0 ? 50000 : 0;
  const total = subtotal + tax + shipping;
  return { subtotal, tax, shipping, total };
}

// آپدیت عدد سبد
export function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
    countEl.textContent = totalQty;
  }
}

// افزودن محصول
export function addToCart(id) {
  const product = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  renderCart();
}

// حذف محصول
export function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

// رندر سبد خرید
export function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} × ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} تومان
      <button onclick="removeFromCart(${item.id})">❌</button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = total.toLocaleString();
  updateCartCount();
}

// نمایش محصولات (products.html)
const productList = document.getElementById("product-list");
if (productList) {
  renderProducts(products);

  // دسته‌بندی
  const categoryBtns = document.querySelectorAll(".categories button");
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.category;
      if (cat === "all") {
        renderProducts(products);
      } else {
        renderProducts(products.filter(p => p.category === cat));
      }
    });
  });
}

function renderProducts(list) {
  productList.innerHTML = "";
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${p.thumbnail}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price.toLocaleString()} تومان</p>
      <button>افزودن به سبد</button>
    `;
    div.querySelector("button").addEventListener("click", () => addToCart(p.id));
    productList.appendChild(div);
  });
}

// برای دسترسی global
window.removeFromCart = removeFromCart;

renderCart();
// نمایش/مخفی کردن سبد خرید
const cartIcon = document.querySelector('.cart');
const cartBox = document.getElementById('cart-box');

if (cartIcon && cartBox) {
  cartIcon.addEventListener('click', () => {
    cartBox.classList.toggle('active');
  });
}
