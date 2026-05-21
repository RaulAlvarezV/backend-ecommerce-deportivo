require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const connectDB = require('../config/db');

const PORT = process.env.PORT || 8080;

const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Exponer io en la app para usarlo en controllers
app.set('socketio', io);

// ── WebSockets ───────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// ── Inicializar servidor ─────────────────────────────────────────────────────
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Vista home:              http://localhost:${PORT}/`);
    console.log(`Vista tiempo real:       http://localhost:${PORT}/realtimeproducts`);
    console.log(`API productos:           http://localhost:${PORT}/api/products`);
    console.log(`API carritos:            http://localhost:${PORT}/api/carts`);
  });
});
