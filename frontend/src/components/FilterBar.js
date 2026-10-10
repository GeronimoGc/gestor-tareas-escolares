import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../theme/colors';

export default function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  filtroEstado, 
  onFiltroEstadoChange,
  materiaSeleccionada,
  onMateriaChange,
  materias = []
}) {
  const tabs = [
    { key: 'todas', label: 'Todas' },
    { key: 'pendiente', label: 'Pendientes ⏳' },
    { key: 'entregada', label: 'Entregadas ✅' },
  ];

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título o materia..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearButton}>
            <Text style={styles.clearText}>✖</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Selector de estado (Todas / Pendientes / Entregadas) */}
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = filtroEstado === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => onFiltroEstadoChange(tab.key)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Píldoras de materias si existen */}
      {materias.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.materiasScroll}
        >
          <TouchableOpacity
            style={[styles.materiaChip, !materiaSeleccionada && styles.materiaChipActive]}
            onPress={() => onMateriaChange('')}
          >
            <Text style={[styles.materiaChipText, !materiaSeleccionada && styles.materiaChipTextActive]}>
              Todas las materias
            </Text>
          </TouchableOpacity>
          {materias.map((mat) => {
            const isChipActive = materiaSeleccionada === mat;
            return (
              <TouchableOpacity
                key={mat}
                style={[styles.materiaChip, isChipActive && styles.materiaChipActive]}
                onPress={() => onMateriaChange(isChipActive ? '' : mat)}
              >
                <Text style={[styles.materiaChipText, isChipActive && styles.materiaChipTextActive]}>
                  {mat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    outlineStyle: 'none',
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  materiasScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  materiaChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  materiaChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  materiaChipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  materiaChipTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
