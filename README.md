# WeSportt Reto - Bloque 1

Miniprogram de WeChat que consume una API publica de productos, muestra un listado, permite ver el detalle de un producto y guarda un carrito persistente con `wx.setStorageSync`.

## Funcionalidades

- Listado de productos desde `https://fakestoreapi.com/products` usando `wx.request`.
- Estado de carga mientras se obtienen los datos.
- Mensaje de error y boton de reintento si falla la llamada.
- Navegacion al detalle con paso del parametro `id`.
- Detalle completo del producto desde `https://fakestoreapi.com/products/{id}`.
- Boton "Añadir al carrito".
- Persistencia del carrito con `wx.setStorageSync` y lectura con `wx.getStorageSync`.
- Pagina de carrito para comprobar que los productos se mantienen entre navegaciones.

## Como ejecutarlo

1. Instala y abre WeChat DevTools.
2. Selecciona **Import Project**.
3. Elige esta carpeta como directorio del proyecto.
4. Usa el AppID `touristappid` o tu propio AppID de pruebas.
5. Si usas `touristappid`, activa en DevTools la opcion de no verificar dominios validos para desarrollo, porque la API externa es `https://fakestoreapi.com`.
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

## Notas de implementacion

- La pagina `pages/products/products` realiza la llamada principal con `wx.request`, `method: 'GET'`, callbacks `success` y `fail`.
- La pagina `pages/detail/detail` recibe `id` por query string mediante `wx.navigateTo`.
- El carrito se centraliza en `utils/cart.js` para evitar duplicar el acceso a storage.

## 1C - Arquitectura y decisiones

### Como estructure los archivos

El proyecto esta separado siguiendo la estructura habitual de un miniprogram de WeChat:

- `app.js`, `app.json` y `app.wxss`: configuracion global, paginas registradas y estilos base.
- `pages/products`: pagina principal con el listado de productos y la llamada a la API publica.
- `pages/detail`: pagina de detalle, recibe el `id` por parametro y permite añadir el producto al carrito.
- `pages/cart`: pagina auxiliar para comprobar que el carrito persiste entre navegaciones.
- `utils/cart.js`: modulo reutilizable para leer, guardar, contar y limpiar productos del carrito usando storage local.

Esta separacion mantiene cada pantalla con su logica, vista y estilos propios, y evita duplicar la logica del carrito en varias paginas.

### Donde guardaria el token de autenticacion

Si la API requiriera login con WeChat, no guardaria credenciales sensibles ni secretos de aplicacion en el miniprogram. El flujo recomendado seria enviar el `code` obtenido con `wx.login` a un backend propio, que intercambiaria ese codigo con WeChat y devolveria al miniprogram un token de sesion propio de corta duracion.

En el cliente guardaria solo ese token de sesion, por ejemplo con `wx.setStorageSync`, o en memoria si la sesion debe ser aun mas restrictiva. El `appSecret`, tokens maestros, refresh tokens sensibles y cualquier clave privada deberian quedarse siempre en el backend.

### Que cambiaria para escalar a 50.000 usuarios diarios

Para soportar 50.000 usuarios diarios, evitaria que el miniprogram dependiera directamente de una API publica externa. Pondria un backend propio como capa intermedia para controlar autenticacion, cache, limites de uso y formato de datos.

Cambios principales:

- Cachearia listados y detalles de productos con Redis, CDN o cache HTTP para reducir llamadas repetidas.
- Anadaria rate limiting y proteccion ante abuso por usuario, IP o sesion.
- Separaria lectura y escritura: catalogo optimizado para consultas, carrito/pedidos en servicios persistentes propios.
- Usaria base de datos gestionada con indices adecuados y replicas de lectura si el trafico crece.
- Centralizaria logs, metricas y alertas para detectar errores, latencia y caidas.
- Definiria respuestas paginadas para no enviar catalogos grandes de una sola vez.
- Mantendria secretos y tokens en variables de entorno o un gestor de secretos del backend.
