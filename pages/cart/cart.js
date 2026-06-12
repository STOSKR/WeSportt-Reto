const { clearCart, getCartAsync } = require('../../utils/cart');

Page({
  data: {
    cart: [],
    loading: true,
    total: '0.00',
    skeletonItems: [1, 2, 3]
  },

  onShow() {
    this.loadCart();
  },

  loadCart() {
    this.setData({
      loading: true
    });

    getCartAsync((cart) => {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      this.setData({
        cart,
        loading: false,
        total: total.toFixed(2)
      });
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
