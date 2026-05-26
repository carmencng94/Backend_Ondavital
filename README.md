# 🚀 Onda Vital — Guía de Instalación y Despliegue

¡Bienvenido al repositorio de **Onda Vital**! Este proyecto es una aplicación web completa y premium para el centro de bienestar Onda Vital. Integra un backend robusto en Node.js (Express), una base de datos autogestionada con SQLite (`better-sqlite3`), un panel de administración para la gestión de pre-reservas, y un chatbot de Inteligencia Artificial de última generación (configurado mediante OpenRouter para ofrecer soporte multimodelo/resiliente).

Este documento te guiará paso a paso para clonar, configurar y ejecutar el proyecto desde cero en tu entorno local o en producción.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

*   **Node.js**: Versión **18.x o superior** (se recomienda la versión LTS más reciente).
*   **Git**: Para la clonación del repositorio.
*   **Gestor de Paquetes**: `npm` (incluido por defecto con Node.js).
*   *(Opcional en Windows)*: Herramientas de compilación de C++ (requerido a veces por `better-sqlite3` si no descarga el binario precompilado; normalmente se soluciona ejecutando `npm install` en una consola con permisos).

---

## 🛠️ Paso a Paso para Levantar el Proyecto

Sigue detenidamente estos pasos para poner en marcha la aplicación:

### 1. Clonar el Repositorio
Abre tu terminal y ejecuta el siguiente comando para clonar el repositorio en tu máquina local:

```bash
git clone https://github.com/carmencng94/backend_ondavital.git
cd backend_ondavital
```

### 2. Entrar a la Carpeta de la Aplicación
El proyecto principal está autocontenido dentro del directorio `onda-vital`. Muévete a esta carpeta para realizar la instalación y configuración:

```bash
cd onda-vital
```

### 3. Instalar las Dependencias
Ejecuta el siguiente comando para instalar todos los módulos necesarios definidos en el `package.json`:

```bash
npm install
```

> [!NOTE]
> Durante este proceso se instalará `better-sqlite3`, el cual compilará de forma automática los enlaces nativos para la base de datos local SQLite.

### 4. Configurar las Variables de Entorno (`.env`)
El proyecto requiere una serie de variables de entorno para la conexión con las APIs de IA, encriptación y base de datos. 

1. Copia el archivo de plantilla `.env.example` y renómbralo a `.env`:
   * **En Windows (PowerShell):**
     ```powershell
     copy .env.example .env
     ```
   * **En Linux/macOS:**
     ```bash
     cp .env.example .env
     ```

2. Abre el archivo `.env` recién creado en tu editor de código favorito y completa/configura las variables. A continuación, se detallan las más importantes:

| Variable | Descripción | Valor por Defecto / Ejemplo |
| :--- | :--- | :--- |
| `PORT` | Puerto en el que escuchará el servidor Express | `3051` |
| `NODE_ENV` | Entorno de ejecución (`development` o `production`) | `development` |
| `CHAT_PROVIDER` | Proveedor de IA principal para el chatbot | `openrouter` |
| `OPENROUTER_API_KEY` | Clave API de OpenRouter (para acceso a Llama, Gemini, etc.) | *Tu API Key* |
| `AES_SECRET_KEY` | Clave simétrica de 32 bytes en formato hex (64 caracteres) para encriptar los datos de contacto en la base de datos | *Una clave de 64 caracteres hex* |
| `JWT_SECRET` | Clave secreta y segura para firmar tokens JWT de sesión | *Tu firma JWT* |
| `ADMIN_USER` | Nombre de usuario para acceder al panel de administración | `admin` (Cambiar) |
| `ADMIN_PASSWORD` | Contraseña para acceder al panel de administración | `DVQR` (Cambiar) |
| `CORS_ORIGINS` | Orígenes permitidos separados por comas para evitar bloqueos CORS | `http://localhost:3000,http://localhost:5173,http://localhost:3051` |

> [!IMPORTANT]
> **Generar Claves de Seguridad:**
> * Para **`AES_SECRET_KEY`**: Puedes generar una clave aleatoria de 32 bytes (64 caracteres hexadecimales). Ejemplo rápido en la terminal de Node:
>   ```bash
>   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
>   ```
> * Para **`JWT_SECRET`**: Genera otra clave aleatoria similar para asegurar las sesiones del panel de administración.

---

### 5. Configurar Google Calendar (Opcional)
La sincronización de reservas utiliza Google Calendar. Para habilitarla:

1. Ve a la consola de desarrolladores de Google Cloud y crea una **Cuenta de Servicio** (Service Account).
2. Genera una clave en formato **JSON** para esa Cuenta de Servicio.
3. Descarga el archivo JSON y guárdalo dentro de la carpeta `onda-vital/config/` con el nombre exacto de **`google-credentials.json`**.
4. En tu archivo `.env`, asegúrate de definir el ID del calendario en la variable `GOOGLE_CALENDAR_ID`.
5. Recuerda compartir tu Google Calendar con el email de la Cuenta de Servicio (ej. `agente-calendario@...iam.gserviceaccount.com`) otorgándole permisos de edición y administración de eventos.

> [!WARNING]
> Este archivo `google-credentials.json` contiene claves de acceso privadas y está listado en `.gitignore` para prevenir que se suba accidentalmente a Git. **Nunca lo expongas públicamente.**

---

### 6. Levantar el Servidor
Una vez completada la instalación y configuración del `.env`, arranca la aplicación.

*   **Modo de Desarrollo / Producción:**
    ```bash
    npm start
    ```
    O también:
    ```bash
    npm run dev
    ```

El servidor se iniciará en el puerto configurado (por defecto: `http://localhost:3051`). Deberías ver un mensaje en consola similar a:
```text
Servidor de Onda Vital escuchando en http://localhost:3051
```

Abre `http://localhost:3051` en tu navegador para ver y probar la aplicación web premium junto con su chatbot integrado.

---

## 💾 Base de Datos (SQLite Autogestionada)

El proyecto utiliza una base de datos **SQLite local** a través del módulo de alto rendimiento `better-sqlite3`.

*   **¿Requiere migraciones previas?** No. Al iniciar la aplicación por primera vez (`npm start`), los modelos de base de datos (`ReservaModel.js`, `ContentModel.js`, `ChangeLogModel.js`) comprueban de forma automática si las tablas existen. Si no están creadas, ejecutan las sentencias `CREATE TABLE` oportunas y cargan los textos web predeterminados.
*   **Ubicación de la DB:** El archivo de base de datos se guarda en la ruta indicada en tu variable `DB_PATH` (por defecto `./memory.db` dentro del directorio `onda-vital`).
*   **Respaldo:** Al tratarse de un único archivo de base de datos, para hacer una copia de seguridad basta con duplicar o copiar el archivo `memory.db`.

---

## 🤖 El Asistente de IA (Chatbot)

La inteligencia artificial del chatbot está optimizada para guiar a los clientes en la consulta de salas, horarios, tarifas y capturar los datos necesarios para generar una **pre-reserva**.

*   **Lógica de Flujo:** 
    1. El usuario interactúa con la burbuja de chat en el frontend.
    2. El backend procesa la petición y llama a la API de **OpenRouter** enviando el historial de conversación y un *System Prompt* diseñado específicamente para el centro de bienestar Onda Vital.
    3. Si la IA detecta que el usuario quiere realizar una reserva y tiene todos los datos necesarios (nombre, sala, fecha, horario y contacto), genera en su respuesta una etiqueta estructurada: `[RESERVA_LISTA:nombre|sala|fecha|horario]`.
    4. El backend detecta esta etiqueta, crea automáticamente el registro de reserva con estado `pendiente` en la base de datos SQLite y devuelve un identificador de tracking único (ej. `OV-20260519-7F3A92`).
    5. El frontend detecta este flag, abre el modal de confirmación y permite al usuario finalizar el proceso enviando los datos por WhatsApp al administrador para su aprobación definitiva.

---

## 📁 Estructura del Proyecto (Patrón MVC)

A continuación se detalla la distribución de archivos clave en la carpeta `onda-vital`:

```text
onda-vital/
├── server.js               # Punto de entrada principal (Servidor Express)
├── package.json            # Dependencias y scripts del proyecto
├── .env.example            # Plantilla para la configuración de variables de entorno
├── .env                    # Configuración activa del proyecto (Ignorado en Git)
├── memory.db               # Base de datos SQLite (Creado al arrancar)
│
├── config/
│   └── google-credentials.json # Credenciales de la API de Google (Ignorado en Git)
│
├── models/                 # Modelos (Gestión de datos con la base de datos)
│   ├── SalaModel.js        # Estructura y datos de las salas polivalentes
│   ├── ReservaModel.js     # Gestión e inserción de pre-reservas (Encriptadas)
│   ├── ContentModel.js     # Textos dinámicos e idiomas de la web
│   └── ChangeLogModel.js   # Registro de auditoría/cambios para el panel admin
│
├── controllers/            # Controladores (Lógica intermedia del negocio)
│   ├── ChatController.js   # Lógica del chatbot y comunicación con OpenRouter/Grok
│   └── ReservaController.js # Procesamiento y validación de reservas
│
├── routes/                 # Enrutadores (Mapeo de Endpoints del Backend)
│   ├── chatRoutes.js       # Endpoints de comunicación del Asistente de IA
│   ├── reservaRoutes.js    # Creación y consulta de reservas de usuarios
│   ├── adminReservaRoutes.js # Gestión administrativa de reservas (Aceptar/Rechazar)
│   └── authRoutes.js       # Rutas de autenticación para administradores
│
├── services/               # Servicios auxiliares (Integraciones de terceros)
│   ├── GoogleCalendarService.js # Sincronización bidireccional con Google Calendar
│   ├── AvailabilityService.js   # Comprobación de disponibilidad de salas
│   └── BookRetrievalService.js  # RAG / Búsqueda en el libro manual de Resosense
│
└── public/                 # Archivos estáticos servidos en el Frontend
    ├── index.html          # Interfaz de usuario (Página principal premium)
    ├── style.css           # Tokens de diseño y estilos CSS puros (Glassmorphism)
    └── app.js              # Lógica cliente y conexión WebSocket/HTTP con el API
```

---

## ⚡ Comandos Útiles e Inicialización

El proyecto dispone de una serie de scripts útiles en la raíz de `onda-vital/` que puedes ejecutar de forma manual en caso de necesidad:

*   **Ingesta del Libro Manual de Resosense (RAG):**
    Si deseas re-indexar o ingestar el manual de Resosense para mejorar la precisión del chatbot:
    ```bash
    node ingest_book.js
    ```
*   **Prueba de Conexión de Google Calendar:**
    Permite validar de forma independiente si las credenciales de Google Calendar están bien configuradas y el servicio es accesible:
    ```bash
    node test-google.js
    ```
*   **Descarga e Ingesta de Imágenes:**
    Scripts auxiliares de automatización multimedia del sitio:
    ```bash
    node fetch_imgs.js
    ```

---

## 🛡️ Notas de Seguridad y Producción

1.  **Cambio de Credenciales:** Por seguridad, no utilices la combinación de usuario y contraseña por defecto (`admin` / `DVQR`) en entornos productivos. Modifica estas credenciales en el archivo `.env`.
2.  **Seguridad CORS:** En producción, cambia la variable `CORS_ORIGINS` para admitir únicamente los dominios autorizados de tu frontend final, evitando que otros sitios web llamen sin permiso a tu API.
3.  **Protección de Datos:** Las reservas almacenan el campo de contacto encriptado simétricamente con AES-256 en base de datos. Asegúrate de respaldar adecuadamente el valor de tu `AES_SECRET_KEY` o no podrás recuperar ni desencriptar los números de contacto de tus clientes si reinstalas la aplicación.

¡Listo! Ya tienes todo lo necesario para poner en marcha la aplicación web de **Onda Vital**. Si experimentas cualquier problema durante el levantamiento del entorno, comprueba la correcta configuración de tus variables en el archivo `.env`.
