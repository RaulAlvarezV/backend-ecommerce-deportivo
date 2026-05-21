const { Router } = require('express');
const ProductManagerMongo = require('../dao/managers/ProductManagerMongo');
const CartManagerMongo = require('../dao/managers/CartManagerMongo');

const router = Router();
const productManager = new ProductManagerMongo();
const cartManager = new CartManagerMongo();

// Alias para compatibilidad con rutas que ya usan `manager`
const manager = productManager;

// ── Middleware: resuelve o crea el carrito persistente via cookie ─────────────
const CART_COOKIE = 'cartId';
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 días

const resolveCart = async (req, res, next) => {
  let cartId = req.cookies[CART_COOKIE];
  if (cartId) {
    // Verificar que el carrito aún exista en la BD
    const exists = await cartManager.getCartById(cartId).catch(() => null);
    if (!exists) cartId = null;
  }
  if (!cartId) {
    const newCart = await cartManager.createCart();
    cartId = newCart._id.toString();
    res.cookie(CART_COOKIE, cartId, { maxAge: COOKIE_MAX_AGE, httpOnly: true });
  }
  res.locals.cartId = cartId;
  next();
};

router.use(resolveCart);

// GET / - Vista home con listado de productos
router.get('/', async (req, res) => {
  try {
    const result = await manager.getProducts({ limit: 10, page: 1 });
    res.render('home', {
      title: 'Ecommerce Deportivo',
      products: result.payload,
    });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

// GET /products - Catálogo paginado con filtros
router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, query = '', sort = '' } = req.query;
    const result = await manager.getProducts({ limit, page, query, sort });

    const base = `/products?limit=${limit}&query=${query}&sort=${sort}`;

    res.render('products', {
      title: 'Catálogo de Productos',
      products: result.payload,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `${base}&page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `${base}&page=${result.nextPage}` : null,
      query,
      sort,
      limit,
    });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

// GET /products/:pid - Detalle de un producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).render('error', { message: 'Producto no encontrado' });
    }
    res.render('productDetail', { title: product.title, product });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

// GET /cart - Redirige al carrito persistente del usuario (via cookie)
router.get('/cart', (req, res) => {
  res.redirect(`/carts/${res.locals.cartId}`);
});

// GET /carts/:cid - Vista del carrito con populate
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).render('error', { message: 'Carrito no encontrado' });
    }

    // Convertir a objeto plano y agregar subtotal por ítem
    const cartObj = cart.toObject();
    let total = 0;
    cartObj.products = cartObj.products.map((item) => {
      const subtotal = item.product.price * item.quantity;
      total += subtotal;
      return { ...item, subtotal: subtotal.toFixed(2) };
    });

    res.render('cart', {
      title: 'Mi Carrito',
      cart: cartObj,
      cartId: req.params.cid,
      total: total.toFixed(2),
    });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

// GET /realtimeproducts - Vista con WebSockets
router.get('/realtimeproducts', async (req, res) => {
  try {
    const result = await manager.getProducts({ limit: 10, page: 1 });
    res.render('realTimeProducts', {
      title: 'Productos en Tiempo Real',
      products: result.payload,
    });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

module.exports = router;
