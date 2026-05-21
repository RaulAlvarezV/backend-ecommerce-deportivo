const ProductManagerMongo = require('../dao/managers/ProductManagerMongo');

const manager = new ProductManagerMongo();

const getProducts = async (req, res) => {
  try {
    const { limit, page, query, sort } = req.query;
    const result = await manager.getProducts({ limit, page, query, sort });
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await manager.addProduct(req.body);

    const io = req.app.get('socketio');
    const result = await manager.getProducts({ limit: 10, page: 1 });
    io.emit('updateProducts', result.payload);

    res.status(201).json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await manager.updateProduct(req.params.pid, req.body);
    if (!product) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await manager.deleteProduct(req.params.pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Producto no encontrado' });
    }

    const io = req.app.get('socketio');
    const result = await manager.getProducts({ limit: 10, page: 1 });
    io.emit('updateProducts', result.payload);

    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
