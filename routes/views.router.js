const { Router } = require('express');
const ProductManagerMongo = require('../dao/managers/ProductManagerMongo');

const router = Router();
const manager = new ProductManagerMongo();

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
