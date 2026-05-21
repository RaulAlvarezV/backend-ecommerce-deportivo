const { Router } = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controller');

const router = Router();

// GET /api/products?limit=10&page=1&query=categoria&sort=asc
router.get('/', getProducts);

// GET /api/products/:pid
router.get('/:pid', getProductById);

// POST /api/products
router.post('/', createProduct);

// PUT /api/products/:pid
router.put('/:pid', updateProduct);

// DELETE /api/products/:pid
router.delete('/:pid', deleteProduct);

module.exports = router;
