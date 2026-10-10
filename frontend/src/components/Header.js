import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

export default function Header({ estadisticas, onOpenModal, onOpenConfig, onRefresh }) {
  const total = estadisticas?.total || 0;
  const pendientes = estadisticas?.pendientes || 0;
  const entregadas = estadisticas?.entregadas || 0;
  const progreso = estadisticas?.progreso || (total > 0 ? Math.round((entregadas / total) * 100) : 0);

  return (
    <View style={styles.container}>
      {/* Barra superior con distintivo institucional */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.senaBadge}>
            <Text style={styles.senaBadgeText}>SENA</Text>
          </View>
          <View>
            <Text style={styles.appTitle}>Gestor de Tareas</Text>
            <Text style={styles.subtitle}>ADSO • Quinto Trimestre</Text>
          </View>
        </View>

        <View style={styles.actionIcons}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onRefresh}
            accessibilityLabel="Refrescar lista"
          >
            <Text style={styles.iconText}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onOpenConfig}
            accessibilityLabel="Configurar IP del Backend"
          >
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tarjeta de métricas y resumen (Dashboard) */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.pendiente }]}>{pendientes}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.entregada }]}>{entregadas}</Text>
            <Text style={styles.statLabel}>Entregadas</Text>
          </View>
        </View>

        {/* Barra de progreso visual */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progreso académico</Text>
            <Text style={styles.progressValue}>{progreso}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${Math.min(progreso, 100)}%` }]} />
          </View>
        </View>
      </View>

      {/* Botón flotante/destacado para agregar tarea */}
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={onOpenModal} 
        activeOpacity={0.85}
      >
        <Text style={styles.addButtonIcon}>➕</Text>
        <Text style={styles.addButtonText}>Nueva Tarea Escolar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senaBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  senaBadgeText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 99,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonIcon: {
    fontSize: 16,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
