const { Router } = require('express');
const {
  createCart,
  getCartById,
  addProductToCart,
  updateCart,
  updateProductQuantity,
  deleteProductFromCart,
  clearCart,
} = require('../controllers/carts.controller');

const router = Router();

// POST /api/carts
router.post('/', createCart);

// GET /api/carts/:cid (con populate)
router.get('/:cid', getCartById);

// POST /api/carts/:cid/products/:pid
router.post('/:cid/products/:pid', addProductToCart);

// PUT /api/carts/:cid (reemplazar todos los productos)
router.put('/:cid', updateCart);

// PUT /api/carts/:cid/products/:pid (actualizar cantidad)
router.put('/:cid/products/:pid', updateProductQuantity);

// DELETE /api/carts/:cid/products/:pid (eliminar producto del carrito)
router.delete('/:cid/products/:pid', deleteProductFromCart);

// DELETE /api/carts/:cid (vaciar carrito)
router.delete('/:cid', clearCart);

module.exports = router;
