import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { getApiBaseUrl, setApiBaseUrl, testApiConnection } from '../api/tareaApi';

export default function ConfigModal({ visible, onClose, onConfigSaved }) {
  const [url, setUrl] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testApiConnection(url);
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    setApiBaseUrl(url);
    if (onConfigSaved) onConfigSaved();
    onClose();
  };

  const handleSetPreset = (preset) => {
    setUrl(preset);
    setTestResult(null);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.title}>⚙️ Conexión del Backend</Text>
              <Text style={styles.subtitle}>Configuración de red para React Native y Docker</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>URL Base de la API REST:</Text>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={(txt) => {
              setUrl(txt);
              setTestResult(null);
            }}
            placeholder="http://192.168.1.106:5000/api"
            autoCapitalize="none"
          />

          {/* Presets rápidos */}
          <Text style={styles.presetLabel}>Opciones rápidas según tu entorno:</Text>
          <View style={styles.presetRow}>
            <TouchableOpacity
              style={styles.presetBtn}
              onPress={() => handleSetPreset('http://localhost:5000/api')}
            >
              <Text style={styles.presetBtnText}>💻 Localhost (Navegador/PC)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetBtn}
              onPress={() => handleSetPreset('http://192.168.1.106:5000/api')}
            >
              <Text style={styles.presetBtnText}>📱 IP Wi-Fi (Expo Go en Móvil)</Text>
            </TouchableOpacity>
          </View>

          {/* Resultado de la prueba */}
          {testing && (
            <View style={styles.statusBox}>
              <ActivityIndicator color={COLORS.primary} size="small" />
              <Text style={styles.statusText}>Probando conexión con el servidor...</Text>
            </View>
          )}

          {testResult && (
            <View
              style={[
                styles.statusBox,
                testResult.success ? styles.statusBoxSuccess : styles.statusBoxError,
              ]}
            >
              <Text style={styles.statusIcon}>{testResult.success ? '✅' : '❌'}</Text>
              <Text
                style={[
                  styles.statusText,
                  { color: testResult.success ? COLORS.entregada : COLORS.danger },
                ]}
              >
                {testResult.success
                  ? '¡Conexión Exitosa con el Backend y MongoDB!'
                  : `Error: ${testResult.error}`}
              </Text>
            </View>
          )}

          {/* Botones de acción */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.testBtn} onPress={handleTest} disabled={testing}>
              <Text style={styles.testBtnText}>🔍 Probar Conexión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    width: '100%',
    maxWidth: 480,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
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
  presetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 12,
    marginBottom: 6,
  },
  presetRow: {
    gap: 6,
    marginBottom: 12,
  },
  presetBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  presetBtnText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
  },
  statusBoxSuccess: {
    backgroundColor: COLORS.entregadaBg,
    borderWidth: 1,
    borderColor: COLORS.entregada,
  },
  statusBoxError: {
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  statusIcon: {
    fontSize: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  testBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  testBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
});
