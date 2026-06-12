const { countItems, getCart } = require('../../utils/cart');

Page({
  data: {
    products: [],
    loading: false,
    error: '',
    cartCount: 0
  },

  onLoad() {
    this.loadProducts();
  },

  onShow() {
    this.refreshCartCount();
  },

  refreshCartCount() {
    this.setData({
      cartCount: countItems(getCart())
    });
  },

  loadProducts() {
    this.setData({
      loading: true,
      error: ''
    });

    wx.request({
      url: `${getApp().globalData.apiBaseUrl}/products`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300 && Array.isArray(res.data)) {
          this.setData({
            products: res.data,
            loading: false
          });
          return;
        }

        this.setData({
          loading: false,
          error: 'No se pudieron cargar los productos. Intentalo de nuevo.'
        });
      },
      fail: () => {
        this.setData({
          loading: false,
          error: 'Error de conexion al obtener los productos.'
        });
      }
    });
  },

  goToDetail(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  goToCart() {
    wx.navigateTo({
      url: '/pages/cart/cart'
    });
  }
});
