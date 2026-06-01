## Context

El sistema de Onda Vital utiliza un Virtual DOM personalizado muy ligero en `public/src/utils.js`. Los textos editables son devueltos por `i18n.t(key)`. 

Para implementar la edición visual en caliente, agregaremos metadatos a los nodos DOM y crearemos un controlador interactivo del lado del cliente que se active solo para administradores validados por cookie de sesión (`adminToken`).

## Goals / Non-Goals

**Goals:**
- Detectar de forma automática al administrador logueado en la web pública inspeccionando las cookies del cliente.
- Activar el "Modo Editor" inyectando estilos de hover (borde dorado dorado y puntero interactivo ✏️) sobre elementos con atributo `data-i18n-key`.
- Permitir intercambio interactivo de DOM: al hacer clic, el texto se convierte en `<input>` o `<textarea>`, y al hacer "blur" (perder el foco) se realiza una petición HTTP asíncrona segura.
- Crear y proteger el endpoint `/api/content/update` en Express para guardar de forma segura los cambios en la base de datos SQLite.

**Non-Goals:**
- Implementar un editor WYSIWYG complejo de formato enriquecido (Rich Text) con botones de negrita/cursiva (se mantendrá texto plano / markdown para preservar la integridad visual diseñada).

## Decisions

### 1. Marcación Explícita de Nodos DOM con data-i18n-key
Para saber qué texto pertenece a qué clave de traducción en SQLite:
* Añadiremos de manera explícita el atributo `'data-i18n-key': 'clave_trad'` en las definiciones de componentes de `public/src/components/` (ej: `HomeSection.js`, `SalasSection.js`).
* *Por qué*: Es una aproximación explícita, predecible y con cero sobrecostos de procesamiento en el Virtual DOM, evitando tener que interceptar dinámicamente strings en caliente.

### 2. Activación por Cookie y Event Listeners Globales
* En `public/src/main.js`, al cargar el sitio web (`DOMContentLoaded`), verificaremos si `document.cookie` contiene el token `adminToken`.
* Si se detecta:
  * Se añadirá la clase `.admin-mode` al `<body>` para activar los estilos de hover y edición mediante CSS puro.
  * Se registrará un escuchador de eventos click global (`document.addEventListener('click')`) con delegación de eventos. Si se hace clic en un elemento con `data-i18n-key`, se abrirá el editor en línea de inmediato.

### 3. Intercambio Inline y Guardado Reactivo (Blur a Guardado)
Cuando se hace clic en un elemento etiquetado:
1. El elemento guarda su clave de traducción y su HTML original.
2. Se reemplaza el contenido por un `<input type="text">` o `<textarea>` (si el texto es muy largo), asignándole un estilo elegante e idéntico de tipografía y tamaño para que no afecte el layout.
3. Al ocurrir el evento `blur` (o pulsar `Enter`), el cliente realiza un `fetch('/api/content/update')` enviando `{ key, value, lang: i18n.currentLanguage }`.
4. El servidor responde exitosamente, el editor se destruye y el DOM del cliente se actualiza de forma reactiva llamando a `render(App(), ...)` instantáneamente para mostrar el resultado real del customizer.

## Risks / Trade-offs

- **[Risk]** Peticiones maliciosas o inyecciones de código por usuarios no autorizados simulando la petición HTTP de guardado.
  - *Mitigation*: El endpoint en Express `/api/content/update` estará protegido en el backend por `authMiddleware.verifyAdmin`, el cual desencripta el JWT `adminToken` firmado en el servidor. Aunque el cliente simule el Modo Editor, la base de datos SQLite rechazará cualquier cambio si no se provee la firma criptográfica válida.
