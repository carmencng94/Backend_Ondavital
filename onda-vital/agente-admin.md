## 🎯 Objetivo
Permitir que tu cliente (administrador) pueda:
- Subir y reemplazar imágenes de la web  
- Editar textos (descripciones, títulos, secciones)  
- Gestionar contenido sin romper el diseño  
- Todo con validaciones, seguridad y una interfaz sencilla  

---

# 🧩 **1. Sistema de Autenticación para Administradores**

### Requisitos:
- Login con usuario + contraseña  
- Contraseña encriptada (bcrypt)  
- Sesiones seguras (JWT o cookies firmadas)  
- Middleware `isAdmin` para proteger rutas  

### Flujo:
1. El administrador entra en `/admin`  
2. Introduce credenciales  
3. Accede al panel  
4. Todas las rutas de edición están protegidas  

---

# 🖼️ **2. Subida y Gestión de Imágenes**

### Validaciones recomendadas:
- Tamaño máximo: 2–5 MB  
- Formatos permitidos: `.jpg`, `.jpeg`, `.png`, `.webp`  
- Rechazar imágenes corruptas o con dimensiones absurdas  
- Renombrado automático para evitar conflictos  
- Optimización automática (sharp)  

### Flujo de subida:
1. El admin selecciona una imagen  
2. El sistema valida formato y tamaño  
3. Optimiza la imagen  
4. La guarda en `/uploads` o en un bucket externo  
5. Actualiza la base de datos con la nueva ruta  
6. La web se actualiza automáticamente  

---

# ✏️ **3. Edición de Textos en la Web**

### Qué se puede editar:
- Títulos de secciones  
- Descripciones de salas  
- Textos de botones  
- Información de contacto  
- Precios o condiciones  
- Cualquier bloque de contenido dinámico  

### Validaciones:
- Longitud máxima  
- Evitar HTML malicioso  
- Evitar scripts  
- Previsualización antes de guardar  

### Flujo:
1. El admin abre el editor de texto  
2. Modifica el contenido  
3. Previsualiza  
4. Guarda  
5. La web se actualiza en tiempo real  

---

# 🗂️ **4. Estructura recomendada en la base de datos sqlite**

### Tabla `content_blocks`
| id | key | value | type | updated_at |
|----|-----|--------|------|------------|
| 1 | sala_jardin_desc | "Sala con vistas..." | text | fecha |
| 2 | hero_image | "/uploads/hero.webp" | image | fecha |

Esto permite:
- Cambiar cualquier texto sin tocar código  
- Cambiar imágenes sin romper rutas  
- Mantener un historial de cambios  

---

# 🛡️ **5. Seguridad del Panel**

- Rutas `/admin/*` protegidas  
- Rate limiting en login  
- Logs de cambios (quién editó qué)  
- Validación de archivos en backend (no solo frontend)  
- Sanitización de texto para evitar XSS  

---

# 🧭 **6. Interfaz del Panel (UX profesional)**

### Secciones:
- **Dashboard**  
- **Gestión de imágenes**  
- **Gestión de textos**  
- **Vista previa de la web**  
- **Historial de cambios**  
- **Cerrar sesión**

### Estilo:
- Minimalista  
- Íconos claros  
- Botones grandes  
- Previsualización en vivo  

---

# 🔌 **7. Integración con tu asistente Vitalis**

Tu asistente puede:
- Guiar al admin dentro del panel  
- Explicar cómo subir imágenes  
- Avisar si un texto es demasiado largo  
- Recordar buenas prácticas de diseño  
- Confirmar cambios antes de guardarlos  

Ejemplo:
> “Carmen, la imagen que has subido pesa 6 MB. Te recomiendo reducirla para mejorar la velocidad de carga. ¿Quieres que la optimice automáticamente?”

---

# ✨ **Resultado final**
Tu cliente podrá:
- Cambiar imágenes sin romper nada  
- Editar textos sin tocar código  
- Mantener la web actualizada  
- Tener control total del contenido  
- Con una experiencia profesional y segura
