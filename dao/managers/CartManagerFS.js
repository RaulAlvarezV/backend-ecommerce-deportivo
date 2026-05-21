const fs = require('fs').promises;
const path = require('path');

class CartManagerFS {
  constructor() {
    this.path = path.join(__dirname, '../../../data/carts.json');
    this._init();
  }

  async _init() {
    try {
      await fs.access(this.path);
    } catch {
      await fs.mkdir(path.dirname(this.path), { recursive: true });
      await fs.writeFile(this.path, JSON.stringify([], null, 2));
    }
  }

  async _read() {
    const raw = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(raw);
  }

  async _write(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._read();
    const newCart = { id: Date.now(), products: [] };
    carts.push(newCart);
    await this._write(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._read();
    return carts.find((c) => c.id === id) ?? null;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this._read();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) return null;

    const existing = cart.products.find((p) => p.product === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this._write(carts);
    return cart;
  }

  async deleteProductFromCart(cartId, productId) {
    const carts = await this._read();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) return null;

    cart.products = cart.products.filter((p) => p.product !== productId);
    await this._write(carts);
    return cart;
  }

  async clearCart(cartId) {
    const carts = await this._read();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) return null;

    cart.products = [];
    await this._write(carts);
    return cart;
  }
}

module.exports = CartManagerFS;
