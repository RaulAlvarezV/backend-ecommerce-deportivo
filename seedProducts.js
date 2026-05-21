// seedProducts.js
// Ejecutar con: node seedProducts.js
// Requiere que exista el archivo .env con MONGO_URI configurado

require('dotenv').config();
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// ── Modelo inline (no depende de la carpeta models/) ─────────────────────────
const productSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  code:        { type: String, required: true, unique: true },
  price:       { type: Number, required: true },
  status:      { type: Boolean, default: true },
  stock:       { type: Number, required: true },
  category:    { type: String, required: true },
  thumbnails:  { type: [String], default: [] },
});
productSchema.plugin(mongoosePaginate);
const Product = mongoose.model('Product', productSchema);

// ── Productos de ejemplo ──────────────────────────────────────────────────────
const products = [
  // Fútbol (4 productos)
  {
    title:       'Pelota de Fútbol Profesional',
    description: 'Pelota oficial de cuero sintético, ideal para partidos y entrenamiento en césped natural o artificial.',
    code:        'FUT-001',
    price:       4500,
    status:      true,
    stock:       30,
    category:    'Fútbol',
    thumbnails:  ['https://images.unsplash.com/photo-1614632537190-23e4146777db?w=400&q=80&auto=format&fit=crop'],
  },
  {
    title:       'Botines Nike Mercurial',
    description: 'Botines de alta performance con suela de tapones intercambiables, diseño aerodinámico para máxima velocidad.',
    code:        'FUT-002',
    price:       18900,
    status:      true,
    stock:       15,
    category:    'Fútbol',
    thumbnails:  ['https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&q=80&auto=format&fit=crop'],
  },
  {
    title:       'Arco de Fútbol Plegable',
    description: 'Arco portátil de acero y red reforzada, ideal para entrenamientos y picados en espacios reducidos.',
    code:        'FUT-003',
    price:       7200,
    status:      true,
    stock:       10,
    category:    'Fútbol',
    thumbnails:  ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80&auto=format&fit=crop'],
  },
  {
    title:       'Canilleras de Fútbol',
    description: 'Canilleras con protección de polipropileno y espuma de absorción de impactos, talla adulto.',
    code:        'FUT-004',
    price:       1800,
    status:      false,
    stock:       0,
    category:    'Fútbol',
    thumbnails:  ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80&auto=format&fit=crop'],
  },

  // Running (3 productos)
  {
    title:       'Zapatillas Running Asics Gel',
    description: 'Zapatillas con tecnología Gel de amortiguación, upper de malla transpirable, ideales para largas distancias.',
    code:        'RUN-001',
    price:       22500,
    status:      true,
    stock:       20,
    category:    'Running',
    thumbnails:  ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop'],
  },
  {
    title:       'Reloj GPS Garmin Forerunner',
    description: 'Reloj deportivo con GPS integrado, monitor de frecuencia cardíaca, autonomía de 7 días en modo smartwatch.',
    code:        'RUN-002',
    price:       65000,
    status:      true,
    stock:       8,
    category:    'Running',
    thumbnails:  ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80&auto=format&fit=crop'],
  },
  {
    title:       'Mochila de Hidratación 2L',
    description: 'Mochila ligera con bolsa de agua de 2 litros incluida, compartimentos extra para trail running y ciclismo.',
    code:        'RUN-003',
    price:       5400,
    status:      true,
    stock:       25,
    category:    'Running',
    thumbnails:  ['https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=400&q=80&auto=format&fit=crop'],
  },

  // Tenis (3 productos)
  {
    title:       'Raqueta de Tenis Wilson Pro',
    description: 'Raqueta de grafito de alta resistencia, marco de 100 pulgadas cuadradas, ideal para jugadores intermedios.',
    code:        'TEN-001',
    price:       14300,
    status:      true,
    stock:       12,
    category:    'Tenis',
    thumbnails:  ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&q=80&auto=format&fit=crop'],
  },
  {
    title:       'Pelotas de Tenis Head x3',
    description: 'Pack de 3 pelotas de tenis pressurizadas, aptas para canchas de arcilla y cemento, certificadas ITF.',
    code:        'TEN-002',
    price:       950,
    status:      true,
    stock:       50,
    category:    'Tenis',
    thumbnails:  ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop'],
  },
  {
    title:       'Zapatillas Tenis Adidas Barricade',
    description: 'Zapatillas especializadas para tenis con refuerzo lateral, suela de goma resistente a la abrasión.',
    code:        'TEN-003',
    price:       19800,
    status:      true,
    stock:       18,
    category:    'Tenis',
    thumbnails:  ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80&auto=format&fit=crop'],
  },
];

// ── Ejecutar seed ─────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('✅ Conectado a MongoDB');

    // Eliminar productos previos para evitar duplicados de código
    await Product.deleteMany({});
    console.log('🗑️  Colección products limpiada');

    // Insertar todos los productos
    const inserted = await Product.insertMany(products);
    console.log(`✅ ${inserted.length} productos insertados correctamente:\n`);

    inserted.forEach((p) =>
      console.log(`   [${p.category}] ${p.title} — $${p.price} (stock: ${p.stock})`)
    );

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
};

seed();
