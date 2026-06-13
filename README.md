# WeSportt Reto - Bloque 1

Miniprogram de WeChat que consume una API pública de productos, muestra un listado, permite ver el detalle de un producto y guarda un carrito persistente con `wx.setStorageSync`.

## Funcionalidades

- Listado de productos desde `https://fakestoreapi.com/products` usando `wx.request`.
- Estado de carga mientras se obtienen los datos.
- Mensaje de error y botón de reintento si falla la llamada.
- Navegación al detalle con paso del parámetro `id`.
- Detalle completo del producto desde `https://fakestoreapi.com/products/{id}`.
- Botón "Añadir al carrito".
- Persistencia del carrito con `wx.setStorageSync` y lectura con `wx.getStorageSync` / `wx.getStorage`.
- Página de carrito para comprobar que los productos se mantienen entre navegaciones.

## Cómo ejecutarlo

1. Instala y abre WeChat DevTools.
2. Selecciona **Import Project**.
3. Elige esta carpeta como directorio del proyecto.
4. Usa el AppID `touristappid` o tu propio AppID de pruebas.
5. Si usas `touristappid`, activa en DevTools la opción de no verificar dominios válidos para desarrollo, porque la API externa es `https://fakestoreapi.com`.
6. Compila el proyecto. La primera pantalla muestra el listado de productos.

## Estructura

```text
app.js
app.json
app.wxss
project.config.json
sitemap.json
utils/cart.js
pages/
  products/
  detail/
  cart/
```

## Notas de implementación

- La página `pages/products/products` realiza la llamada principal con `wx.request`, `method: 'GET'`, callbacks `success`, `fail` y `complete`.
- El estado `loading` controla la vista de carga y `error` controla el mensaje con botón de reintento.
- La página `pages/detail/detail` recibe `id` por query string mediante `wx.navigateTo`.
- El carrito se centraliza en `utils/cart.js` para evitar duplicar el acceso a storage.
