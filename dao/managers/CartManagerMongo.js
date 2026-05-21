const Cart = require('../../models/Cart');

class CartManagerMongo {
  async createCart() {
    return await Cart.create({ products: [] });
  }

  async getCartById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const existing = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    return await cart.save();
  }

  async updateCart(cartId, products) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { products },
      { new: true }
    ).populate('products.product');
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const item = cart.products.find(
      (p) => p.product.toString() === productId
    );
    if (!item) return null;

    item.quantity = quantity;
    return await cart.save();
  }

  async deleteProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    return await cart.save();
  }

  async clearCart(cartId) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
  }
}

module.exports = CartManagerMongo;
