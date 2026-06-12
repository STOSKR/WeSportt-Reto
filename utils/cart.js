const CART_STORAGE_KEY = 'cart';

function getCart() {
  const cart = wx.getStorageSync(CART_STORAGE_KEY);
  return Array.isArray(cart) ? cart : [];
}

function saveCart(cart) {
  wx.setStorageSync(CART_STORAGE_KEY, cart);
  return cart;
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  return saveCart(cart);
}

function countItems(cart) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function clearCart() {
  return saveCart([]);
}

module.exports = {
  addToCart,
  clearCart,
  countItems,
  getCart,
  saveCart
};
