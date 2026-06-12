const { addToCart, countItems, getCart } = require('../../utils/cart');

Page({
  data: {
    id: null,
    product: null,
    loading: true,
    error: '',
    cartCount: 0
  },

  onLoad(options) {
    this.setData({
      id: Number(options.id)
    });
    this.loadProduct();
  },

  onShow() {
    this.refreshCartCount();
  },

  refreshCartCount() {
    this.setData({
      cartCount: countItems(getCart())
    });
  },

  loadProduct() {
    if (!this.data.id) {
      wx.hideLoading();

      this.setData({
        loading: false,
        error: 'No se recibio el identificador del producto.'
      });
      return;
    }

    wx.showNavigationBarLoading();
    wx.showLoading({
      title: 'Cargando producto',
      mask: true
    });

    this.setData({
      loading: true,
      error: ''
    });

    wx.request({
      url: `${getApp().globalData.apiBaseUrl}/products/${this.data.id}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300 && res.data && res.data.id) {
          this.setData({
            product: res.data,
            loading: false
          });
          return;
        }

        this.setData({
          loading: false,
          error: 'No se pudo cargar el detalle del producto.'
        });
      },
      fail: () => {
        this.setData({
          loading: false,
          error: 'Error de conexion al obtener el detalle.'
        });
      },
      complete: () => {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    });
  },

  addCurrentProductToCart() {
    if (!this.data.product) {
      return;
    }

    const cart = addToCart(this.data.product);
    this.setData({
      cartCount: countItems(cart)
    });

    wx.showToast({
      title: 'Anadido al carrito',
      icon: 'success'
    });
  },

  goToCart() {
    wx.showLoading({
      title: 'Cargando',
      mask: true
    });
    wx.navigateTo({
      url: '/pages/cart/cart',
      fail: () => {
        wx.hideLoading();
      }
    });
  }
});
