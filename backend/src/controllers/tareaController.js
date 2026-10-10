const Tarea = require('../models/Tarea');

// @desc    Obtener todas las tareas (con filtros opcionales por estado, materia y búsqueda)
// @route   GET /api/tareas
exports.getTareas = async (req, res) => {
  try {
    const { estado, materia, q } = req.query;
    let query = {};

    if (estado && ['pendiente', 'entregada'].includes(estado)) {
      query.estado = estado;
    }

    if (materia) {
      query.materia = { $regex: materia, $options: 'i' };
    }

    if (q) {
      query.$or = [
        { titulo: { $regex: q, $options: 'i' } },
        { materia: { $regex: q, $options: 'i' } },
        { descripcion: { $regex: q, $options: 'i' } },
      ];
    }

    const tareas = await Tarea.find(query).sort({ fechaEntrega: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tareas.length,
      data: tareas,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las tareas',
      error: error.message,
    });
  }
};

// @desc    Obtener una sola tarea por su ID
// @route   GET /api/tareas/:id
exports.getTareaById = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada',
      });
    }

    return res.status(200).json({
      success: true,
      data: tarea,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al buscar la tarea',
      error: error.message,
    });
  }
};

// @desc    Crear una nueva tarea
// @route   POST /api/tareas
exports.createTarea = async (req, res) => {
  try {
    const { titulo, materia, descripcion, fechaEntrega, estado, prioridad } = req.body;

    if (!titulo || !materia || !fechaEntrega) {
      return res.status(400).json({
        success: false,
        message: 'Por favor complete todos los campos requeridos: título, materia y fecha de entrega.',
      });
    }

    const nuevaTarea = await Tarea.create({
      titulo,
      materia,
      descripcion,
      fechaEntrega,
      estado: estado || 'pendiente',
      prioridad: prioridad || 'media',
    });

    return res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: nuevaTarea,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error al registrar la tarea',
      error: error.message,
    });
  }
};

// @desc    Actualizar una tarea completa o parcial
// @route   PUT /api/tareas/:id
exports.updateTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada',
      });
    }

    const tareaActualizada = await Tarea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: tareaActualizada,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message,
    });
  }
};

// @desc    Alternar estado entre 'pendiente' y 'entregada'
// @route   PATCH /api/tareas/:id/toggle
exports.toggleEstado = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada',
      });
    }

    const nuevoEstado = tarea.estado === 'pendiente' ? 'entregada' : 'pendiente';
    tarea.estado = nuevoEstado;
    await tarea.save();

    return res.status(200).json({
      success: true,
      message: `Tarea marcada como ${nuevoEstado}`,
      data: tarea,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al cambiar estado de la tarea',
      error: error.message,
    });
  }
};

// @desc    Eliminar una tarea
// @route   DELETE /api/tareas/:id
exports.deleteTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada',
      });
    }

    await Tarea.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Tarea eliminada correctamente de MongoDB',
      data: { id: req.params.id },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la tarea',
      error: error.message,
    });
  }
};

// @desc    Obtener métricas y resumen (Dashboard)
// @route   GET /api/tareas/estadisticas
exports.getEstadisticas = async (req, res) => {
  try {
    const total = await Tarea.countDocuments();
    const pendientes = await Tarea.countDocuments({ estado: 'pendiente' });
    const entregadas = await Tarea.countDocuments({ estado: 'entregada' });

    return res.status(200).json({
      success: true,
      data: {
        total,
        pendientes,
        entregadas,
        progreso: total > 0 ? Math.round((entregadas / total) * 100) : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al calcular estadísticas',
      error: error.message,
    });
  }
};
