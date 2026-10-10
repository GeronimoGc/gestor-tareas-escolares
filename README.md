# 📱 Gestor de Tareas Escolares (SENA ADSO)
### Actividad Evaluativa: Aplicación Móvil con MongoDB (Quinto Trimestre)

Aplicación móvil integral y API REST desarrollada en parejas para la gestión de tareas escolares del SENA, con persistencia en **MongoDB** (compatible con MongoDB Atlas y local), frontend reactivo en **React Native / Expo** y orquestación con **Docker Compose**.

---

- **Aprendiz:** `Geronimo Gonzalez C`
- **Ficha / Programa:** ADSO3314566 - Quinto Trimestre
- **Tema Elegido:** Gestor de Tareas Escolares

---

## 🚀 Características Principales
- **CRUD Completo:**
  - **Crear (POST):** Registro de tareas con título, materia, descripción, fecha de entrega y prioridad.
  - **Leer (GET):** Consulta de tareas en tiempo real con buscador por palabra clave y filtros de estado (*Todas*, *Pendientes*, *Entregadas*) y materias.
  - **Actualizar (PUT & PATCH):** Edición completa de datos y alternancia rápida de estado (Pendiente ⏳ <-> Entregada ✅).
  - **Eliminar (DELETE):** Eliminación física de documentos con confirmación de seguridad.
- **Dashboard de Métricas:** Contador de tareas totales, pendientes, entregadas y porcentaje de avance escolar en tiempo real.
- **Doble Persistencia:** Funciona directamente con **MongoDB Atlas en la nube** o con el contenedor local de **MongoDB 7.0** incluido en Docker.
- **Visor Gráfico Incluido:** Contenedor de **Mongo Express** para visualizar la base de datos desde el navegador web sin instalar software adicional.
- **Portabilidad Total:** Orquestación en 1 comando con **Docker Compose**.

---

## 🛠️ Tecnologías Utilizadas
| Capa | Tecnología |
| :--- | :--- |
| **Frontend Móvil** | React Native, Expo SDK 57, React Native Web |
| **Backend API** | Node.js, Express, Mongoose, CORS, Dotenv |
| **Base de Datos** | MongoDB 7.0 / MongoDB Atlas |
| **Orquestación** | Docker Compose |
| **Visor de BD** | Mongo Express / MongoDB Atlas Dashboard |

---

## 📋 Estructura del Proyecto
```text
gestor-tareas-escolares/
├── docker-compose.yml       # Orquestador de MongoDB, Mongo-Express y Backend
├── SUSTENTACION.md          # Libreto preparado para la sustentación oral (5 min)
├── README.md                # Documentación del proyecto
├── .env                     # Variables de entorno principales
│
├── backend/                 # Servidor API REST Node.js & Express
│   ├── Dockerfile           # Imagen Docker del backend
│   ├── seed.js              # Script para sembrar datos reales de prueba
│   ├── package.json
│   └── src/
│       ├── config/db.js     # Conexión Mongoose a MongoDB Atlas / Local
│       ├── models/Tarea.js  # Esquema NoSQL de la colección 'tareas'
│       ├── controllers/     # Controladores CRUD y estadísticas
│       ├── routes/          # Rutas de la API (/api/tareas)
│       └── server.js        # Punto de entrada de la aplicación
│
└── frontend/                # Aplicación Móvil React Native / Expo
    ├── App.js               # Vista principal con listado, métricas y modales
    ├── app.json             # Configuración de Expo
    ├── package.json
    └── src/
        ├── api/tareaApi.js  # Cliente HTTP y selector dinámico de IP
        ├── components/      # Componentes UI (Header, TareaCard, Modales)
        └── theme/colors.js  # Paleta de colores institucional SENA
```

---

## ⚡ Guía Rápida de Despliegue

### 1. Iniciar los Servicios con Docker Compose
Abre una terminal en la raíz del proyecto y ejecuta:
```bash
docker compose up -d --build
```
Esto levantará automáticamente:
- **Backend API:** `http://localhost:5000/api/tareas`
- **Mongo Express (Visor BD):** `http://localhost:8085`
- **MongoDB:** `localhost:27017`

### 2. Sembrar Datos de Prueba en MongoDB (Opcional pero Recomendado)
Para cargar tareas iniciales de ejemplo con un solo comando:
```bash
cd backend
npm run seed
```

### 3. Iniciar la Aplicación Móvil (Frontend Expo)
En otra terminal:
```bash
cd frontend
npm start
```
- **Para ver en el navegador (PC):** Presiona la tecla `w` en la consola o ejecuta `npm run web`. Se abrirá en `http://localhost:8081`.
- **Para ver en tu celular físico:** Abre la app **Expo Go** (Android / iOS) y escanea el código QR que aparece en pantalla.
  *(Asegúrate de que el celular y el PC estén conectados a la misma red Wi-Fi).*

---

## ☁️ Conexión a MongoDB Atlas (Base de Datos en la Nube)
Si deseas que la app guarde los datos directamente en tu clúster de **MongoDB Atlas**:
1. Abre el archivo `.env` (en la raíz o en `backend/.env`).
2. Reemplaza la variable `MONGODB_URI` con tu cadena de conexión de Atlas:
   ```env
   MONGODB_URI=mongodb+srv://tu_usuario:tu_contraseña@cluster0.mongodb.net/gestor_tareas_sena?retryWrites=true&w=majority
   ```
3. Recuerda configurar en **Network Access** de MongoDB Atlas la IP `0.0.0.0/0` (Allow Access from Anywhere) para permitir la conexión.
4. Reinicia el backend:
   ```bash
   docker compose restart backend
   ```

---

## 📡 Endpoints de la API REST
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Comprobación de estado del servidor |
| `GET` | `/api/tareas` | Obtener todas las tareas (soporta `?estado=pendiente`, `?q=buscar`) |
| `GET` | `/api/tareas/estadisticas` | Retorna total, pendientes, entregadas y progreso % |
| `GET` | `/api/tareas/:id` | Obtener una tarea por su ID |
| `POST` | `/api/tareas` | Crear una nueva tarea |
| `PUT` | `/api/tareas/:id` | Actualizar todos los campos de una tarea |
| `PATCH`| `/api/tareas/:id/toggle` | Alternar rápidamente entre *pendiente* y *entregada* |
| `DELETE`| `/api/tareas/:id` | Eliminar tarea de la base de datos |

---
