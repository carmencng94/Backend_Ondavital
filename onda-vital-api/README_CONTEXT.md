# Onda Vital — Contexto del Proyecto

## Estructura de carpetas
```text
onda-vital/
├── server.js              # Entrada principal, arranque Express
├── package.json           # Dependencias y scripts
├── README_CONTEXT.md      # Este documento de contexto
├── .env.example           # Plantilla de variables de entorno
├── models/
│   ├── SalaModel.js       # Catálogo de salas (datos en memoria)
│   └── ReservaModel.js    # Lógica y almacenamiento de reservas
├── controllers/
│   ├── ChatController.js  # Lógica del chatbot + llamada Anthropic
│   └── ReservaController.js # Orquestación de creación de reservas
├── routes/
│   ├── chatRoutes.js      # Endpoints del Asistente
│   ├── reservaRoutes.js   # Endpoints de Reservas
│   └── salaRoutes.js      # Endpoints del Catálogo
└── public/
    ├── index.html         # Frontend premium (todo embebido)
    ├── style.css          # Tokens de diseño y estilos CSS puros
    └── app.js             # Lógica frontend vanilla JS
```

## Dependencias instaladas
- `express`: ^4.18.2
- `@anthropic-ai/sdk`: ^0.20.0
- `dotenv`: ^16.3.1
- `cors`: ^2.8.5

## Variables de entorno (.env)
```env
grock=tu_clave_aqui
PORT=3000
```

## Cómo arrancar
1. Abre tu terminal en la carpeta `onda-vital`.
2. Ejecuta `npm install` para instalar las dependencias.
3. Copia el archivo `.env.example` y renómbralo a `.env`. (En Windows: `copy .env.example .env`).
4. Añade tu `grok` real en tu archivo `.env`.
5. Ejecuta `node server.js` (o `npm start`).
6. Abre http://localhost:3000 en tu navegador.

## Prompt exitoso
Construye la aplicación web completa de "Onda Vital", un centro de bienestar con chatbot IA (grok), sistema de reservas, frontend premium y backend Node.js en arquitectura MVC.

## Diccionario de términos técnicos
- **Payload:** Datos reales que se envían en el cuerpo de una petición HTTP (ej: `{ mensaje: "Hola", historial: [] }`).
- **Middleware:** Funciones intermedias en Express (como `cors()`) que procesan la petición antes de llegar a la ruta.
- **MVC (Model-View-Controller):** Arquitectura que separa los datos (Modelo), la interfaz (Vista o Frontend) y la lógica de negocio (Controlador).
- **Función Pura:** Función que con las mismas entradas devuelve siempre la misma salida sin causar efectos secundarios. Usada en `SalaModel.obtenerTodas()`.
- **CSS Tokens:** Variables nativas (`--color-primary`) usadas como fuente única de verdad para el diseño.

## Flujo de la aplicación (Lectura Guiada)
1. El usuario abre la web → Express sirve `public/index.html`.
2. El usuario hace clic en el widget flotante → se abre la ventana de chat y el bot saluda automáticamente.
3. El usuario escribe un mensaje → `app.js` llama a `POST /api/chat`.
4. `chatRoutes.js` recibe la petición → extrae `{ mensaje, historial }` → llama `ChatController.responder()`.
5. `ChatController` construye el array de mensajes (historial + nuevo mensaje).
6. Se llama a la API de grok con el system prompt de Onda Vital y el modelo `grok-4.1-fast`.
7. La respuesta se analiza mediante expresión regular: ¿contiene `[RESERVA_LISTA:nombre|sala|fecha|horario]`?
8. Si la contiene → `ReservaModel.guardar()` registra la pre-reserva automáticamente + se envía el flag `reservaDetectada` al frontend. Se elimina el texto del tag oculto para que el usuario reciba un texto limpio.
9. El frontend muestra la burbuja de respuesta y, al comprobar el flag de reserva, abre el modal elegante de Onda Vital.
10. El modal prepara un enlace de WhatsApp directo a David (601 39 21 61) con los datos pre-rellenados de la sala, fecha y hora tras confirmar.
