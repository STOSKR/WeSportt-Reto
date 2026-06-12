const { addToCart, countItems, getCart } = require('../../utils/cart');

Page({
  data: {
    id: null,
    product: null,
    loading: true,
    error: '',
    cartCount: 0,
    successMessageVisible: false,
    routeLoading: false
  },

  onLoad(options) {
    this.setData({
      id: Number(options.id)
    });
    setTimeout(() => {
      wx.hideLoading();
    }, 220);
    this.loadProduct();
  },

  onShow() {
    this.setData({
      routeLoading: false
    });
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
        loading: false,
        error: 'No se recibio el identificador del producto.'
      });
      return;
    }

    wx.showNavigationBarLoading();

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
      }
    });
  },

  addCurrentProductToCart() {
    if (!this.data.product) {
      return;
    }

    const cart = addToCart(this.data.product);
    this.setData({
      cartCount: countItems(cart),
      successMessageVisible: true
    });

    clearTimeout(this.successMessageTimer);
    this.successMessageTimer = setTimeout(() => {
      this.setData({
        successMessageVisible: false
      });
    }, 1800);
  },

  goToCart() {
    this.setData({
      routeLoading: true
    }, () => {
      setTimeout(() => {
        wx.showLoading({
          title: 'Abriendo carrito',
          mask: true
        });
        wx.navigateTo({
          url: '/pages/cart/cart',
          fail: () => {
            wx.hideLoading();
            this.setData({
              routeLoading: false
            });
          }
        });
      }, 80);
    });
  },

  onUnload() {
    clearTimeout(this.successMessageTimer);
  }
});
