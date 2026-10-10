import { Platform } from 'react-native';

// IP detectada del equipo para permitir pruebas desde dispositivos móviles en la misma red Wi-Fi
const DEFAULT_HOST_IP = '192.168.1.106';

const getInitialBaseUrl = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const host = window.location.hostname || 'localhost';
    return `http://${host}:5000/api`;
  }
  return `http://${DEFAULT_HOST_IP}:5000/api`;
};

let currentBaseUrl = getInitialBaseUrl();

// Intento de cargar URL guardada en almacenamiento web si está disponible
if (typeof localStorage !== 'undefined') {
  const saved = localStorage.getItem('sena_api_base_url');
  if (saved) {
    currentBaseUrl = saved;
  }
}

export const getApiBaseUrl = () => currentBaseUrl;

export const setApiBaseUrl = (newUrl) => {
  const sanitized = newUrl.replace(/\/+$/, '');
  currentBaseUrl = sanitized.endsWith('/api') ? sanitized : `${sanitized}/api`;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('sena_api_base_url', currentBaseUrl);
  }
  return currentBaseUrl;
};

// Probar conexión con el servidor (Health Check)
export const testApiConnection = async (testUrl) => {
  try {
    const base = testUrl || currentBaseUrl;
    const cleanBase = base.replace(/\/+$/, '');
    const healthUrl = cleanBase.endsWith('/api') 
      ? `${cleanBase}/health` 
      : `${cleanBase}/api/health`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(healthUrl, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    return { success: false, error: `Código de respuesta: ${res.status}` };
  } catch (err) {
    return { 
      success: false, 
      error: err.name === 'AbortError' ? 'Tiempo de espera agotado (4s)' : err.message 
    };
  }
};

// Obtener todas las tareas (con filtro opcional de estado y búsqueda)
export const fetchTareas = async ({ estado, q } = {}) => {
  const params = new URLSearchParams();
  if (estado && estado !== 'todas') params.append('estado', estado);
  if (q) params.append('q', q);

  const url = `${currentBaseUrl}/tareas?${params.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al obtener tareas');
  return data.data;
};

// Obtener estadísticas y progreso
export const fetchEstadisticas = async () => {
  const response = await fetch(`${currentBaseUrl}/tareas/estadisticas`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al obtener estadísticas');
  return data.data;
};

// Crear nueva tarea en MongoDB
export const createTarea = async (tareaData) => {
  const response = await fetch(`${currentBaseUrl}/tareas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tareaData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al crear la tarea');
  return data.data;
};

// Actualizar tarea existente en MongoDB
export const updateTarea = async (id, tareaData) => {
  const response = await fetch(`${currentBaseUrl}/tareas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tareaData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al actualizar la tarea');
  return data.data;
};

// Alternar estado (pendiente <-> entregada)
export const toggleEstadoTarea = async (id) => {
  const response = await fetch(`${currentBaseUrl}/tareas/${id}/toggle`, {
    method: 'PATCH',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al cambiar estado');
  return data.data;
};

// Eliminar tarea de MongoDB
export const deleteTarea = async (id) => {
  const response = await fetch(`${currentBaseUrl}/tareas/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al eliminar tarea');
  return data.data;
};
