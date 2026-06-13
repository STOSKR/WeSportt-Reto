const CART_STORAGE_KEY = 'cart';

function getCart() {
  const cart = wx.getStorageSync(CART_STORAGE_KEY);
  return Array.isArray(cart) ? cart : [];
}

function getCartAsync(callback) {
  wx.getStorage({
    key: CART_STORAGE_KEY,
    success: (res) => {
      callback(Array.isArray(res.data) ? res.data : []);
    },
    fail: () => {
      callback([]);
    }
  });
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

function updateCartItemQuantity(productId, quantity) {
  const cart = getCart();
  const nextCart = cart
    .map((item) => {
      if (item.id !== productId) {
        return item;
      }

      return {
        ...item,
        quantity
      };
    })
    .filter((item) => item.quantity > 0);

  return saveCart(nextCart);
}

function removeFromCart(productId) {
  return updateCartItemQuantity(productId, 0);
}

function clearCart() {
  return saveCart([]);
}

module.exports = {
  addToCart,
  clearCart,
  countItems,
  getCart,
  getCartAsync,
  removeFromCart,
  saveCart,
  updateCartItemQuantity
};
