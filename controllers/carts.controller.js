const CartManagerMongo = require('../dao/managers/CartManagerMongo');

const manager = new CartManagerMongo();

const createCart = async (req, res) => {
  try {
    const cart = await manager.createCart();
    res.status(201).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const cart = await manager.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    if (!cart) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const cart = await manager.updateCart(req.params.cid, req.body.products);
    if (!cart) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    const cart = await manager.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      req.body.quantity
    );
    if (!cart) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Carrito o producto no encontrado' });
    }
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    const cart = await manager.deleteProductFromCart(
      req.params.cid,
      req.params.pid
    );
    if (!cart) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await manager.clearCart(req.params.cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
  updateCart,
  updateProductQuantity,
  deleteProductFromCart,
  clearCart,
};
