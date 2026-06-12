const { clearCart, getCart } = require('../../utils/cart');

Page({
  data: {
    cart: [],
    loading: true,
    total: '0.00',
    skeletonItems: [1, 2, 3]
  },

  onShow() {
    setTimeout(() => {
      wx.hideLoading();
    }, 220);
    this.loadCart();
  },

  loadCart() {
    this.setData({
      loading: true
    });

    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    setTimeout(() => {
      this.setData({
        cart,
        loading: false,
        total: total.toFixed(2)
      });
    }, 520);
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
