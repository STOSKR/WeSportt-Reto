const { countItems, getCart } = require('../../utils/cart');

Page({
  data: {
    products: [],
    loading: true,
    error: '',
    cartCount: 0,
    routeLoading: false,
    routeLoadingTitle: '',
    routeLoadingSubtitle: '',
    skeletonItems: [1, 2, 3, 4, 5]
  },

  onLoad() {
    this.loadProducts();
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

  loadProducts() {
    wx.showNavigationBarLoading();

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
      },
      complete: () => {
        wx.hideNavigationBarLoading();
      }
    });
  },

  goToDetail(event) {
    const { id } = event.currentTarget.dataset;
    this.setData({
      routeLoading: true,
      routeLoadingTitle: 'Abriendo producto',
      routeLoadingSubtitle: 'Preparando la ficha'
    }, () => {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`,
        fail: () => {
          this.setData({
            routeLoading: false
          });
        }
      });
    });
  },

  goToCart() {
    this.setData({
      routeLoading: true,
      routeLoadingTitle: 'Abriendo carrito',
      routeLoadingSubtitle: 'Actualizando tus productos'
    }, () => {
      wx.navigateTo({
        url: '/pages/cart/cart',
        fail: () => {
          this.setData({
            routeLoading: false
          });
        }
      });
    });
  }
});
