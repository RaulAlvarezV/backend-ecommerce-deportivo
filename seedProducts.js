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
    thumbnails:  [],
  },
  {
    title:       'Botines Nike Mercurial',
    description: 'Botines de alta performance con suela de tapones intercambiables, diseño aerodinámico para máxima velocidad.',
    code:        'FUT-002',
    price:       18900,
    status:      true,
    stock:       15,
    category:    'Fútbol',
    thumbnails:  [],
  },
  {
    title:       'Arco de Fútbol Plegable',
    description: 'Arco portátil de acero y red reforzada, ideal para entrenamientos y picados en espacios reducidos.',
    code:        'FUT-003',
    price:       7200,
    status:      true,
    stock:       10,
    category:    'Fútbol',
    thumbnails:  [],
  },
  {
    title:       'Canilleras de Fútbol',
    description: 'Canilleras con protección de polipropileno y espuma de absorción de impactos, talla adulto.',
    code:        'FUT-004',
    price:       1800,
    status:      false,
    stock:       0,
    category:    'Fútbol',
    thumbnails:  [],
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
    thumbnails:  [],
  },
  {
    title:       'Reloj GPS Garmin Forerunner',
    description: 'Reloj deportivo con GPS integrado, monitor de frecuencia cardíaca, autonomía de 7 días en modo smartwatch.',
    code:        'RUN-002',
    price:       65000,
    status:      true,
    stock:       8,
    category:    'Running',
    thumbnails:  [],
  },
  {
    title:       'Mochila de Hidratación 2L',
    description: 'Mochila ligera con bolsa de agua de 2 litros incluida, compartimentos extra para trail running y ciclismo.',
    code:        'RUN-003',
    price:       5400,
    status:      true,
    stock:       25,
    category:    'Running',
    thumbnails:  [],
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
    thumbnails:  [],
  },
  {
    title:       'Pelotas de Tenis Head x3',
    description: 'Pack de 3 pelotas de tenis pressurizadas, aptas para canchas de arcilla y cemento, certificadas ITF.',
    code:        'TEN-002',
    price:       950,
    status:      true,
    stock:       50,
    category:    'Tenis',
    thumbnails:  [],
  },
  {
    title:       'Zapatillas Tenis Adidas Barricade',
    description: 'Zapatillas especializadas para tenis con refuerzo lateral, suela de goma resistente a la abrasión.',
    code:        'TEN-003',
    price:       19800,
    status:      true,
    stock:       18,
    category:    'Tenis',
    thumbnails:  [],
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
