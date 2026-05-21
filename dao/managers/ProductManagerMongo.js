const Product = require('../../models/Product');

class ProductManagerMongo {
  async getProducts({ limit = 10, page = 1, query = '', sort = '' } = {}) {
    let filter = {};
    if (query === 'true' || query === 'false') {
      filter = { status: query === 'true' };
    } else if (query) {
      filter = { category: { $regex: query, $options: 'i' } };
    }

    const sortOption =
      sort === 'asc'
        ? { price: 1 }
        : sort === 'desc'
        ? { price: -1 }
        : {};

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption,
      lean: true,
    };

    const result = await Product.paginate(filter, options);

    return {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}&query=${query}&sort=${sort}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}&query=${query}&sort=${sort}`
        : null,
    };
  }

  async getProductById(id) {
    return await Product.findById(id).lean();
  }

  async addProduct(productData) {
    return await Product.create(productData);
  }

  async updateProduct(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = ProductManagerMongo;
