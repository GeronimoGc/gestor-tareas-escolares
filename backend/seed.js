const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tarea = require('./src/models/Tarea');

dotenv.config();

const tareasIniciales = [
  {
    titulo: 'Diseño de Modelo NoSQL en MongoDB',
    materia: 'Bases de Datos Avanzadas',
    descripcion: 'Diseñar el esquema de colecciones y documentos para la evaluación de ADSO.',
    fechaEntrega: '2026-10-15',
    estado: 'entregada',
    prioridad: 'alta',
  },
  {
    titulo: 'Construcción de API REST con Node y Express',
    materia: 'Desarrollo de Software',
    descripcion: 'Implementar los endpoints CRUD para la gestión de tareas escolares.',
    fechaEntrega: '2026-10-18',
    estado: 'entregada',
    prioridad: 'alta',
  },
  {
    titulo: 'Interfaz Móvil en React Native con Expo',
    materia: 'Programación Móvil',
    descripcion: 'Desarrollar vistas, formularios modales y consumo de API con Axios/Fetch.',
    fechaEntrega: '2026-10-22',
    estado: 'pendiente',
    prioridad: 'alta',
  },
  {
    titulo: 'Configuración de Orquestación Docker Compose',
    materia: 'Despliegue y Operaciones',
    descripcion: 'Crear archivo docker-compose.yml para levantar backend y base de datos con un solo comando.',
    fechaEntrega: '2026-10-25',
    estado: 'pendiente',
    prioridad: 'media',
  },
  {
    titulo: 'Taller de Inglés Técnico: Technical Documentation',
    materia: 'Bilingüismo',
    descripcion: 'Redactar el README del proyecto en inglés y español para evidencia de aprendizaje.',
    fechaEntrega: '2026-10-30',
    estado: 'pendiente',
    prioridad: 'baja',
  },
];

const sembrarDatos = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestor_tareas_sena';
    await mongoose.connect(connUri);
    console.log('Conectado a MongoDB para sembrar datos de prueba...');

    // Limpiar colección previa
    await Tarea.deleteMany({});
    console.log('Colección tareas reiniciada.');

    // Insertar tareas iniciales
    const tareasCreadas = await Tarea.insertMany(tareasIniciales);
    console.log(`Se insertaron exitosamente ${tareasCreadas.length} tareas de prueba para el SENA.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error al sembrar datos:', error.message);
    process.exit(1);
  }
};

sembrarDatos();
