const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const productsRouter = require('../routes/products.router');
const cartsRouter = require('../routes/carts.router');
const viewsRouter = require('../routes/views.router');

const app = express();

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// ── Motor de vistas: Handlebars ──────────────────────────────────────────────
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../views/layouts'),
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// ── Rutas API ────────────────────────────────────────────────────────────────
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// ── Rutas de vistas ──────────────────────────────────────────────────────────
app.use('/', viewsRouter);

// ── Manejo de rutas no encontradas ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});

module.exports = app;
