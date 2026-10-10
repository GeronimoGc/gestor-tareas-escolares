const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestor_tareas_sena';
    
    // Configuración recomendada para Mongoose 8
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000, // Timeout de 5s para detectar rápido problemas de conexión
    });

    console.log(`=========================================`);
    console.log(` MongoDB Conectado Exitosamente!`);
    console.log(` Host: ${conn.connection.host}`);
    console.log(` Base de datos: ${conn.connection.name}`);
    console.log(`=========================================`);
  } catch (error) {
    console.error(` Error al conectar a MongoDB: ${error.message}`);
    console.log(`
      CONSEJO PARA MONGODB ATLAS:
      1. Asegúrate de haber colocado la IP '0.0.0.0/0' (Allow Access from Anywhere) en Network Access de MongoDB Atlas.
      2. Revisa que tu usuario y contraseña en el .env sean correctos.
      3. Si tienes caracteres especiales en la contraseña, deben estar URL-encoded.
    `);
    // No terminamos el proceso de golpe para permitir reintentos o inspección
  }
};

module.exports = connectDB;
