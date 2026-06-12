const { clearCart, getCart } = require('../../utils/cart');

Page({
  data: {
    cart: [],
    total: '0.00'
  },

  onShow() {
    this.loadCart();
  },

  loadCart() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    this.setData({
      cart,
      total: total.toFixed(2)
    });
  },

  clearCart() {
    clearCart();
    this.loadCart();
    wx.showToast({
      title: 'Carrito vaciado',
      icon: 'success'
    });
  }
});
