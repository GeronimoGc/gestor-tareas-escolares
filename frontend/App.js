import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from './src/theme/colors';
import Header from './src/components/Header';
import FilterBar from './src/components/FilterBar';
import TareaCard from './src/components/TareaCard';
import TareaModal from './src/components/TareaModal';
import ConfigModal from './src/components/ConfigModal';
import {
  fetchTareas,
  fetchEstadisticas,
  createTarea,
  updateTarea,
  toggleEstadoTarea,
  deleteTarea,
} from './src/api/tareaApi';

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');

  // Modales
  const [modalVisible, setModalVisible] = useState(false);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [configVisible, setConfigVisible] = useState(false);

  // Mensaje flash de notificación
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cargar datos desde la API REST conectada a MongoDB
  const cargarDatos = useCallback(async () => {
    try {
      setError(null);
      const [listaTareas, stats] = await Promise.all([
        fetchTareas({
          estado: filtroEstado,
          q: searchQuery,
        }),
        fetchEstadisticas().catch(() => null),
      ]);

      setTareas(listaTareas || []);
      if (stats) setEstadisticas(stats);
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor backend');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filtroEstado, searchQuery]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const onRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  // Crear o Actualizar Tarea
  const handleGuardarTarea = async (tareaData) => {
    if (tareaSeleccionada) {
      // Actualizar (PUT)
      await updateTarea(tareaSeleccionada._id, tareaData);
      showToast('✅ Tarea actualizada en MongoDB');
    } else {
      // Crear (POST)
      await createTarea(tareaData);
      showToast('🎉 Nueva tarea registrada en MongoDB');
    }
    cargarDatos();
  };

  // Alternar estado (PATCH)
  const handleToggleEstado = async (id) => {
    try {
      await toggleEstadoTarea(id);
      showToast('🔄 Estado actualizado');
      cargarDatos();
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    }
  };

  // Eliminar tarea (DELETE)
  const handleEliminarTarea = async (id) => {
    try {
      await deleteTarea(id);
      showToast('🗑️ Tarea eliminada de MongoDB');
      cargarDatos();
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    }
  };

  // Abrir modal en modo crear
  const handleAbrirCrear = () => {
    setTareaSeleccionada(null);
    setModalVisible(true);
  };

  // Abrir modal en modo editar
  const handleAbrirEditar = (tarea) => {
    setTareaSeleccionada(tarea);
    setModalVisible(true);
  };

  // Obtener lista única de materias para los filtros
  const listaMaterias = Array.from(new Set(tareas.map((t) => t.materia).filter(Boolean)));

  // Filtrar localmente por materia seleccionada si aplica
  const tareasFiltradas = materiaSeleccionada
    ? tareas.filter((t) => t.materia.toLowerCase() === materiaSeleccionada.toLowerCase())
    : tareas;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Notificación flotante (Toast) */}
      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Contenedor central responsivo */}
      <View style={styles.wrapper}>
        {/* Cabecera institucional SENA con Dashboard */}
        <Header
          estadisticas={estadisticas}
          onOpenModal={handleAbrirCrear}
          onOpenConfig={() => setConfigVisible(true)}
          onRefresh={onRefresh}
        />

        {/* Filtros de búsqueda, estado y materia */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filtroEstado={filtroEstado}
          onFiltroEstadoChange={setFiltroEstado}
          materiaSeleccionada={materiaSeleccionada}
          onMateriaChange={setMateriaSeleccionada}
          materias={listaMaterias}
        />

        {/* Mensaje de error de conexión con botón de solución */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <View style={styles.errorTextContainer}>
              <Text style={styles.errorTitle}>Error de Conexión con el Backend</Text>
              <Text style={styles.errorDesc}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryBtn} 
                onPress={() => setConfigVisible(true)}
              >
                <Text style={styles.retryBtnText}>Revisar IP / Configurar Backend</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Lista de tareas */}
        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Conectando con MongoDB Atlas...</Text>
          </View>
        ) : (
          <FlatList
            data={tareasFiltradas}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TareaCard
                tarea={item}
                onToggle={handleToggleEstado}
                onEdit={handleAbrirEditar}
                onDelete={handleEliminarTarea}
              />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyTitle}>No hay tareas registradas</Text>
                <Text style={styles.emptyDesc}>
                  {searchQuery || filtroEstado !== 'todas' || materiaSeleccionada
                    ? 'No se encontraron tareas con los filtros actuales.'
                    : 'Añade tu primera tarea del SENA pulsando el botón superior.'}
                </Text>
                <TouchableOpacity style={styles.emptyAddBtn} onPress={handleAbrirCrear}>
                  <Text style={styles.emptyAddBtnText}>➕ Crear Tarea Escolar</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>

      {/* Modal para Crear y Editar Tareas */}
      <TareaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleGuardarTarea}
        tareaEditar={tareaSeleccionada}
      />

      {/* Modal para Configurar IP del Backend */}
      <ConfigModal
        visible={configVisible}
        onClose={() => setConfigVisible(false)}
        onConfigSaved={cargarDatos}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  wrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    backgroundColor: COLORS.background,
  },
  toast: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 45,
    alignSelf: 'center',
    zIndex: 9999,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  toastText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  errorBanner: {
    margin: 16,
    backgroundColor: COLORS.dangerBg,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.danger,
    alignItems: 'flex-start',
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.danger,
  },
  errorDesc: {
    fontSize: 12,
    color: '#7F1D1D',
    marginTop: 2,
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 280,
  },
  emptyAddBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyAddBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
});
