# 🎓 Guía de Sustentación Oral (5 Minutos)
## Actividad Evaluativa: Aplicación Móvil con MongoDB
**Programa:** ADSO - Análisis y Desarrollo de Software  
**Trimestre:** Quinto Trimestre  
**Tema:** Gestor de Tareas Escolares (SENA)  
**Modalidad:** Parejas (2 Aprendices)  

---

## 👥 Distribución de Roles para la Presentación

### 🕒 Minuto 0:00 – 0:30 | Introducción y Planteamiento del Problema
**Vocero: Aprendiz 1**
> *"Buenos días / tardes, instructor. Nosotros somos [Nombre Aprendiz 1] y [Nombre Aprendiz 2].  
> Para esta actividad evaluativa seleccionamos el tema **Gestor de Tareas Escolares**. Desarrollamos una solución integral que permite a los aprendices del SENA registrar, consultar, actualizar y dar seguimiento a sus entregas académicas, asegurando la persistencia de datos en una base de datos NoSQL con **MongoDB** y una aplicación móvil desarrollada con **React Native y Expo**, orquestada de manera profesional y portable mediante **Docker Compose**."*

---

### 🕒 Minuto 0:30 – 1:45 | Arquitectura del Sistema y Esquema de MongoDB
**Vocero: Aprendiz 1**
> *"Nuestra arquitectura se divide en 3 capas desacopladas:*
> 1. ***Frontend Móvil (React Native / Expo):*** *Interfaz de usuario reactiva, con soporte tanto para dispositivos móviles (Android/iOS vía Expo Go) como para previsualización web.*
> 2. ***Backend API REST (Node.js & Express):*** *Controladores que exponen endpoints HTTP para cada una de las operaciones del CRUD.*
> 3. ***Base de Datos NoSQL (MongoDB Atlas / Docker):*** *Utilizamos el ODM **Mongoose** para modelar la colección `tareas`.*
>
> *El esquema de nuestro documento en MongoDB cuenta con los siguientes campos requeridos por la guía:*
> - `titulo` *(String, Obligatorio): Nombre descriptivo de la evidencia o taller.*
> - `materia` *(String, Obligatorio): Competencia o área técnica (ej. Bases de Datos, Móvil, etc.).*
> - `fechaEntrega` *(String/Date, Obligatorio): Fecha límite de entrega de la tarea.*
> - `estado` *(String, Enum: 'pendiente' | 'entregada'): Estado actual de la tarea.*
> - `prioridad` *(String, Enum: 'alta' | 'media' | 'baja'): Nivel de urgencia.*
> - `descripcion` *(String, Opcional): Requisitos o criterios de evaluación.*
> - `timestamps`: *Mongoose gestiona automáticamente la auditoría con `createdAt` y `updatedAt`.*
>
> *Para la conexión utilizamos una variable de entorno `MONGODB_URI` en el archivo `.env`, manteniendo seguras las credenciales y soportando tanto MongoDB Atlas en la nube como despliegue local portable con Docker."*

---

### 🕒 Minuto 1:45 – 3:45 | Demostración en Vivo del CRUD (Crear, Leer, Actualizar, Eliminar)
**Vocero: Aprendiz 2** *(Interactuando con la app y mostrando la consola / Mongo Express / Atlas)*

> *"Ahora procederé a demostrar el funcionamiento del CRUD en tiempo real:*
> 
> 1. **Lectura (Read) y Dashboard:**  
>    *Al abrir la aplicación vemos el listado completo de tareas cargado directamente desde MongoDB, junto con métricas dinámicas que calculan el total de tareas, las pendientes, las entregadas y el porcentaje de progreso académico. También contamos con filtros de búsqueda por palabra clave y por materia.*
>
> 2. **Creación (Create):**  
>    *Hago clic en 'Nueva Tarea Escolar'. Lleno el formulario:  
>    - **Título:** 'Entrega Final de Base de Datos NoSQL'  
>    - **Materia:** 'Bases de Datos Avanzadas'  
>    - **Fecha:** '2026-10-28'  
>    - **Estado:** 'Pendiente'  
>    Al pulsar 'Guardar', el backend procesa la petición `POST /api/tareas` y Mongoose almacena el nuevo documento en MongoDB. Observen cómo la app se actualiza de inmediato con un mensaje de confirmación.*
>
> 3. **Actualización (Update) y Alternancia de Estado:**  
>    *Podemos editar la tarea tocando el lápiz para modificar sus datos (`PUT /api/tareas/:id`).  
>    Además, con solo tocar el botón de verificación en la tarjeta, ejecutamos un `PATCH /api/tareas/:id/toggle` que cambia el estado de 'pendiente' a 'entregada', recalculando automáticamente la barra de progreso.*
>
> 4. **Eliminación (Delete):**  
>    *Finalmente, pulsamos el icono de papelera. La app solicita confirmación y despacha una petición `DELETE /api/tareas/:id`, eliminando el documento de la base de datos de manera definitiva.*
>
> 5. **Verificación en MongoDB (Compass / Atlas / Mongo-Express):**  
>    *[Abrir el navegador en `http://localhost:8085` o la consola de Atlas] Aquí podemos observar que los documentos se sincronizan exactamente con los cambios que acabamos de hacer en la aplicación móvil."*

---

### 🕒 Minuto 3:45 – 4:30 | Docker Compose y Portabilidad
**Vocero: Aprendiz 1 o 2**
> *"Para garantizar que la aplicación sea 100% portable y fácil de desplegar en cualquier máquina sin instalaciones complejas, configuramos **Docker Compose** (`docker-compose.yml`) con tres servicios interconectados:*
> - `mongodb`: *Contenedor oficial de base de datos con volúmenes persistentes.*
> - `mongo-express`: *Panel web en el puerto 8085 para auditar las colecciones.*
> - `backend`: *Contenedor de Node.js Express expuesto en el puerto 5000.*
> *Con un único comando `docker compose up -d`, todo el entorno queda operativo en segundos."*

---

### 🕒 Minuto 4:30 – 5:00 | Conclusiones y Cierre
**Ambos Aprendices**
> *"En conclusión, cumplimos con todos los requisitos técnicos mínimos de la actividad: conexión real a MongoDB, modelo NoSQL coherente, CRUD completo funcional, frontend móvil moderno en React Native y portabilidad total con Docker. Quedamos a su disposición para cualquier pregunta técnica. Muchas gracias."*

---

## 🧠 Preguntas Típicas del Instructor y Cómo Responderlas

1. **¿Qué ventaja tiene MongoDB frente a una base de datos relacional (MySQL/PostgreSQL) en esta app?**  
   *Respuesta:* MongoDB almacena los datos en documentos BSON similares a JSON, lo cual se acopla de manera natural con JavaScript en Node.js y React Native sin necesidad de mapeos complejos. Además, permite un esquema flexible que puede evolucionar fácilmente agregando etiquetas o adjuntos a las tareas sin alterar tablas rígidas.

2. **¿Por qué usan Mongoose si MongoDB es 'schemaless' (sin esquema)?**  
   *Respuesta:* MongoDB no restringe la estructura en el motor, pero a nivel de aplicación empresarial necesitamos integridad de datos. Mongoose nos permite definir validaciones estrictas (campos requeridos, tipos de datos, enums para 'pendiente'/'entregada' y valores por defecto) antes de que los documentos lleguen a la base de datos.

3. **¿Cómo garantizan que la app móvil se conecte al backend si cambian de red?**  
   *Respuesta:* En la app incluimos un modal de configuración (botón ⚙️) que permite cambiar la URL base del backend en caliente sin recompilar el código, además de un botón 'Probar Conexión' que verifica el endpoint `/api/health`.
