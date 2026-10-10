import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { COLORS } from '../theme/colors';

const MATERIAS_SUGERIDAS = [
  'Bases de Datos (MongoDB)',
  'Desarrollo Móvil (React Native)',
  'Backend con Express',
  'Despliegue y Docker',
  'Bilingüismo e Inglés Técnico',
  'Calidad de Software',
];

export default function TareaModal({ visible, onClose, onSave, tareaEditar }) {
  const [titulo, setTitulo] = useState('');
  const [materia, setMateria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [prioridad, setPrioridad] = useState('media');
  const [loading, setLoading] = useState(false);

  // Inicializar formulario al abrir o cambiar de tarea seleccionada
  useEffect(() => {
    if (tareaEditar) {
      setTitulo(tareaEditar.titulo || '');
      setMateria(tareaEditar.materia || '');
      setDescripcion(tareaEditar.descripcion || '');
      setFechaEntrega(tareaEditar.fechaEntrega || '');
      setEstado(tareaEditar.estado || 'pendiente');
      setPrioridad(tareaEditar.prioridad || 'media');
    } else {
      // Valores predeterminados para nueva tarea
      setTitulo('');
      setMateria('');
      setDescripcion('');
      // Fecha de hoy + 7 días por defecto
      const hoy = new Date();
      hoy.setDate(hoy.getDate() + 7);
      setFechaEntrega(hoy.toISOString().split('T')[0]);
      setEstado('pendiente');
      setPrioridad('media');
    }
  }, [tareaEditar, visible]);

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      showError('El título de la tarea es obligatorio.');
      return;
    }
    if (!materia.trim()) {
      showError('Debes ingresar la materia o competencia del SENA.');
      return;
    }
    if (!fechaEntrega.trim()) {
      showError('La fecha de entrega es requerida (formato YYYY-MM-DD).');
      return;
    }

    try {
      setLoading(true);
      await onSave({
        titulo: titulo.trim(),
        materia: materia.trim(),
        descripcion: descripcion.trim(),
        fechaEntrega: fechaEntrega.trim(),
        estado,
        prioridad,
      });
      onClose();
    } catch (err) {
      showError(err.message || 'Error al guardar la tarea en MongoDB');
    } finally {
      setLoading(false);
    }
  };

  const showError = (msg) => {
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert('Atención', msg);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.modalCard}>
          {/* Cabecera del modal */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                {tareaEditar ? '✏️ Editar Tarea Escolar' : '➕ Registrar Tarea Escolar'}
              </Text>
              <Text style={styles.modalSubtitle}>SENA ADSO • Colección MongoDB</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Campo Título */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título de la Tarea *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Taller de CRUD con Mongoose y Expo"
                placeholderTextColor={COLORS.textMuted}
                value={titulo}
                onChangeText={setTitulo}
              />
            </View>

            {/* Campo Materia */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Materia / Competencia *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Bases de Datos NoSQL"
                placeholderTextColor={COLORS.textMuted}
                value={materia}
                onChangeText={setMateria}
              />
              {/* Sugerencias rápidas de materias SENA */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsRow}>
                {MATERIAS_SUGERIDAS.map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={styles.suggestionChip}
                    onPress={() => setMateria(m)}
                  >
                    <Text style={styles.suggestionText}>+ {m}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Fecha de Entrega y Prioridad en fila */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Fecha Entrega *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={COLORS.textMuted}
                  value={fechaEntrega}
                  onChangeText={setFechaEntrega}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Prioridad</Text>
                <View style={styles.segmentedControl}>
                  {['baja', 'media', 'alta'].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.segmentBtn,
                        prioridad === p && styles.segmentBtnActive,
                      ]}
                      onPress={() => setPrioridad(p)}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          prioridad === p && styles.segmentTextActive,
                        ]}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Estado de la Tarea (Requisito: pendiente / entregada) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado de la Tarea *</Text>
              <View style={styles.estadoSelector}>
                <TouchableOpacity
                  style={[
                    styles.estadoBtn,
                    estado === 'pendiente' && styles.estadoBtnPendienteActive,
                  ]}
                  onPress={() => setEstado('pendiente')}
                >
                  <Text style={[
                    styles.estadoBtnText,
                    estado === 'pendiente' && styles.estadoBtnTextActive
                  ]}>
                    ⏳ Pendiente
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.estadoBtn,
                    estado === 'entregada' && styles.estadoBtnEntregadaActive,
                  ]}
                  onPress={() => setEstado('entregada')}
                >
                  <Text style={[
                    styles.estadoBtnText,
                    estado === 'entregada' && styles.estadoBtnTextActive
                  ]}>
                    ✅ Entregada
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Descripción opcional */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción o Criterios de Evaluación</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Detalles sobre lo que se debe entregar..."
                placeholderTextColor={COLORS.textMuted}
                value={descripcion}
                onChangeText={setDescripcion}
                multiline={true}
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitBtnText}>
                {loading ? 'Guardando en MongoDB...' : tareaEditar ? 'Actualizar Tarea' : 'Guardar Tarea'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 14,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  closeBtnText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  formScroll: {
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    outlineStyle: 'none',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  suggestionsRow: {
    marginTop: 6,
    flexDirection: 'row',
  },
  suggestionChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  suggestionText: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    height: 42,
    alignItems: 'center',
  },
  segmentBtn: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  estadoSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  estadoBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  estadoBtnPendienteActive: {
    backgroundColor: COLORS.pendienteBg,
    borderColor: COLORS.pendiente,
  },
  estadoBtnEntregadaActive: {
    backgroundColor: COLORS.entregadaBg,
    borderColor: COLORS.entregada,
  },
  estadoBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  estadoBtnTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 14,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  submitBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
});
