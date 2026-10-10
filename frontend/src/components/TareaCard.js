import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { COLORS } from '../theme/colors';

export default function TareaCard({ tarea, onToggle, onEdit, onDelete }) {
  const isEntregada = tarea.estado === 'entregada';

  // Manejo de confirmación de eliminación compatible con Web y Móvil
  const handleDeleteConfirm = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm(`¿Seguro que deseas eliminar la tarea "${tarea.titulo}" de MongoDB?`);
      if (confirm) onDelete(tarea._id);
    } else {
      Alert.alert(
        'Eliminar Tarea',
        `¿Deseas eliminar "${tarea.titulo}" de MongoDB?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(tarea._id) },
        ]
      );
    }
  };

  // Color según prioridad
  const getPrioridadColor = (pri) => {
    switch (pri) {
      case 'alta': return COLORS.prioridadAlta;
      case 'media': return COLORS.prioridadMedia;
      case 'baja': return COLORS.prioridadBaja;
      default: return COLORS.textSecondary;
    }
  };

  return (
    <View style={[styles.card, isEntregada && styles.cardEntregada]}>
      {/* Encabezado de la tarjeta: Checkbox + Título + Acciones */}
      <View style={styles.headerRow}>
        {/* Botón rápido para alternar estado */}
        <TouchableOpacity 
          style={[styles.checkbox, isEntregada && styles.checkboxActive]}
          onPress={() => onToggle(tarea._id)}
          accessibilityLabel="Cambiar estado"
        >
          {isEntregada ? (
            <Text style={styles.checkboxCheck}>✓</Text>
          ) : (
            <View style={styles.checkboxInnerPending} />
          )}
        </TouchableOpacity>

        {/* Título y Materia */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isEntregada && styles.titleEntregada]}>
            {tarea.titulo}
          </Text>
          <View style={styles.materiaRow}>
            <Text style={styles.materiaIcon}>📚</Text>
            <Text style={styles.materiaText}>{tarea.materia}</Text>
          </View>
        </View>

        {/* Botones de acción (Editar y Eliminar) */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => onEdit(tarea)}
            accessibilityLabel="Editar tarea"
          >
            <Text style={styles.actionBtnText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.deleteBtn]} 
            onPress={handleDeleteConfirm}
            accessibilityLabel="Eliminar tarea"
          >
            <Text style={styles.actionBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Descripción opcional */}
      {!!tarea.descripcion && (
        <Text style={[styles.descripcion, isEntregada && styles.descripcionEntregada]}>
          {tarea.descripcion}
        </Text>
      )}

      {/* Pie de tarjeta: Estado + Fecha de Entrega + Prioridad */}
      <View style={styles.footerRow}>
        <View style={styles.tagsGroup}>
          {/* Badge de Estado Requerido */}
          <View style={[
            styles.badge, 
            isEntregada ? styles.badgeEntregada : styles.badgePendiente
          ]}>
            <Text style={[
              styles.badgeText, 
              isEntregada ? styles.badgeTextEntregada : styles.badgeTextPendiente
            ]}>
              {isEntregada ? 'Entregada' : 'Pendiente'}
            </Text>
          </View>

          {/* Badge de Prioridad */}
          {tarea.prioridad && (
            <View style={[styles.badge, { backgroundColor: '#F1F5F9' }]}>
              <View style={[styles.prioridadDot, { backgroundColor: getPrioridadColor(tarea.prioridad) }]} />
              <Text style={[styles.badgeText, { color: getPrioridadColor(tarea.prioridad) }]}>
                {tarea.prioridad.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Fecha de Entrega */}
        <View style={styles.fechaContainer}>
          <Text style={styles.fechaIcon}>📅</Text>
          <Text style={styles.fechaText}>
            {tarea.fechaEntrega || 'Sin fecha'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardEntregada: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: COLORS.entregada,
    borderColor: COLORS.entregada,
  },
  checkboxCheck: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
  },
  checkboxInnerPending: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 20,
  },
  titleEntregada: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  materiaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  materiaIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  materiaText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: COLORS.dangerBg,
  },
  actionBtnText: {
    fontSize: 13,
  },
  descripcion: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  descripcionEntregada: {
    color: COLORS.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tagsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePendiente: {
    backgroundColor: COLORS.pendienteBg,
  },
  badgeEntregada: {
    backgroundColor: COLORS.entregadaBg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextPendiente: {
    color: COLORS.pendiente,
  },
  badgeTextEntregada: {
    color: COLORS.entregada,
  },
  prioridadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  fechaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fechaIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  fechaText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
