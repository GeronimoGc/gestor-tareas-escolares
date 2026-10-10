const mongoose = require('mongoose');

const TareaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título de la tarea es obligatorio'],
      trim: true,
      maxlength: [100, 'El título no puede exceder 100 caracteres'],
    },
    materia: {
      type: String,
      required: [true, 'La materia o competencia es obligatoria'],
      trim: true,
      maxlength: [60, 'El nombre de la materia no puede exceder 60 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
    },
    fechaEntrega: {
      type: String, // Guardado como 'YYYY-MM-DD' para fácil manejo multiplataforma
      required: [true, 'La fecha de entrega es obligatoria (YYYY-MM-DD)'],
      trim: true,
    },
    estado: {
      type: String,
      enum: {
        values: ['pendiente', 'entregada'],
        message: '{VALUE} no es un estado válido (pendiente o entregada)',
      },
      default: 'pendiente',
    },
    prioridad: {
      type: String,
      enum: ['alta', 'media', 'baja'],
      default: 'media',
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    versionKey: false,
  }
);

module.exports = mongoose.model('Tarea', TareaSchema);
