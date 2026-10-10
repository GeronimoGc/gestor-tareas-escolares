const express = require('express');
const router = express.Router();
const {
  getTareas,
  getTareaById,
  createTarea,
  updateTarea,
  toggleEstado,
  deleteTarea,
  getEstadisticas,
} = require('../controllers/tareaController');

// Rutas de estadísticas
router.get('/estadisticas', getEstadisticas);

// Rutas CRUD principales
router.route('/')
  .get(getTareas)
  .post(createTarea);

router.route('/:id')
  .get(getTareaById)
  .put(updateTarea)
  .delete(deleteTarea);

// Ruta rápida para alternar estado (Pendiente <-> Entregada)
router.patch('/:id/toggle', toggleEstado);

module.exports = router;
