const { addToCart, countItems, getCart } = require('../../utils/cart');

Page({
  data: {
    id: null,
    product: null,
    loading: false,
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
      this.setData({
        error: 'No se recibio el identificador del producto.'
      });
      return;
    }

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
    wx.navigateTo({
      url: '/pages/cart/cart'
    });
  }
});
