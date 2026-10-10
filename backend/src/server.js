const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Conectar a la Base de Datos (MongoDB Atlas o Local)
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Logger simple para auditoría y sustentación
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Ruta de comprobación de salud (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend Gestor de Tareas SENA ADSO funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API de Tareas
app.use('/api/tareas', require('./routes/tareaRoutes'));

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
  console.log(`🌐 API Tareas:   http://localhost:${PORT}/api/tareas`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
