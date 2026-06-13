const { clearCart, countItems, getCartAsync, removeFromCart, updateCartItemQuantity } = require('../../utils/cart');

Page({
  data: {
    cart: [],
    loading: true,
    itemCount: 0,
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
      this.updateCartState(cart, false);
    });
  },

  updateCartState(cart, loading = this.data.loading) {
    const normalizedCart = cart.map((item) => ({
      ...item,
      subtotal: (item.price * item.quantity).toFixed(2)
    }));
    const total = normalizedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    this.setData({
      cart: normalizedCart,
      itemCount: countItems(normalizedCart),
      loading,
      total: total.toFixed(2)
    });
  },

  decreaseQuantity(event) {
    const { id, quantity } = event.currentTarget.dataset;
    const nextQuantity = Number(quantity) - 1;
    const cart = updateCartItemQuantity(Number(id), nextQuantity);
    this.updateCartState(cart, false);
  },

  increaseQuantity(event) {
    const { id, quantity } = event.currentTarget.dataset;
    const nextQuantity = Number(quantity) + 1;
    const cart = updateCartItemQuantity(Number(id), nextQuantity);
    this.updateCartState(cart, false);
  },

  removeItem(event) {
    const { id } = event.currentTarget.dataset;
    const cart = removeFromCart(Number(id));
    this.updateCartState(cart, false);
  },

  clearCart() {
    wx.showModal({
      title: 'Vaciar carrito',
      content: 'Se eliminaran todos los productos del carrito.',
      confirmText: 'Vaciar',
      confirmColor: '#ad2e23',
      success: (res) => {
        if (!res.confirm) {
          return;
        }

        const cart = clearCart();
        this.updateCartState(cart, false);
        this.setData({
          loading: false
        });
      }
    });
  },

  goToProducts() {
    wx.navigateBack({
      delta: 1,
      fail: () => {
        wx.redirectTo({
          url: '/pages/products/products'
        });
      }
    });
  }
});
