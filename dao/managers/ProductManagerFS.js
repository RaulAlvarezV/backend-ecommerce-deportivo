const fs = require('fs').promises;
const path = require('path');

class ProductManagerFS {
  constructor() {
    this.path = path.join(__dirname, '../../../data/products.json');
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

  async getProducts() {
    return await this._read();
  }

  async getProductById(id) {
    const products = await this._read();
    return products.find((p) => p.id === id) ?? null;
  }

  async addProduct(productData) {
    const products = await this._read();

    const exists = products.some((p) => p.code === productData.code);
    if (exists) throw new Error(`El código ${productData.code} ya existe`);

    const newProduct = { id: Date.now(), status: true, thumbnails: [], ...productData };
    products.push(newProduct);
    await this._write(products);
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this._read();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updateData, id };
    await this._write(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this._read();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const [deleted] = products.splice(index, 1);
    await this._write(products);
    return deleted;
  }
}

module.exports = ProductManagerFS;
