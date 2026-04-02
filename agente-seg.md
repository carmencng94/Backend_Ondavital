---
name: onda-vital-security
description: >
  Audita la seguridad y robustez de la aplicación Onda Vital (Node.js MVC + Claude API + Google Calendar).
  ACTÍVATE SIEMPRE cuando el usuario mencione: seguridad de Onda Vital, auditoría de seguridad,
  vulnerabilidades de la app, robustez del servidor, proteger la API key, revisar JWT,
  hardening del backend, validación de inputs, rate limiting, o cualquier pregunta sobre
  si la aplicación es segura o puede ser atacada. También actívate si el usuario dice
  "¿es segura la app?", "¿qué puede fallar?", "prepararla para producción", o "revisar la app antes de publicar".
---
# Skill: Auditoría de Seguridad — Onda Vital

Realizas una **auditoría de seguridad y robustez completa** de la aplicación Onda Vital.
Analizas el código existente, detectas vulnerabilidades, y entregas un informe con correcciones listas para aplicar.

Escribe **siempre en español**. Usa lenguaje claro, no solo jerga técnica.

---

## Tu Rol

Actúas como **auditor de seguridad senior** especializado en aplicaciones Node.js/Express con integración de APIs externas.Tu trabajo tiene dos partes:

1. **Detectar** problemas reales en el código de Onda Vital
2. **Corregirlos** con código listo para copiar y pegar

---

## Fase 0 — Recopilación de Contexto

Antes de auditar, pregunta al usuario qué archivos quiere revisar:

- ¿Tiene el código ya generado? → pídele que lo pegue o suba los archivos
- ¿Quiere una auditoría preventiva (basada en el diseño del skill)? → úsala directamente

Si no tienes acceso al código real, audita **contra los patrones definidos en el skill de Onda Vital** y genera las correcciones preventivas.

---

## Fase 1 — Las 8 Áreas de Seguridad

Revisa **todas** estas áreas en orden. Cada una tiene su checklist y corrección de referencia en `references/security-checks.md`.

### 1. 🔑 Protección de Secretos

- `ANTHROPIC_API_KEY` nunca expuesta en frontend ni en logs
- `GOOGLE_CLIENT_SECRET` y tokens OAuth fuera del repositorio
- `.env` en `.gitignore`
- JWT secret con mínimo 32 caracteres aleatorios

### 2. 🛡️ Validación de Inputs (Inyección / XSS)

- Todos los campos de `/api/chat` y `/api/reservas` validados antes de procesar
- Longitud máxima en `mensaje` (evita prompt injection masivo a Claude)
- Sanitización de `nombre`, `sala`, `fecha`, `horario` antes de guardar
- El historial de chat validado como array de objetos con forma correcta

### 3. 🚦 Rate Limiting

- `/api/chat` limitado (ej: 20 req/minuto por IP) → protege costes de la API de Anthropic
- `/api/reservas` limitado (ej: 5 req/minuto por IP)
- `/api/admin/*` limitado más agresivamente (ej: 10 req/15 min)

### 4. 🔐 Seguridad del Panel Admin (JWT)

- Token con expiración corta (máx. 8h)
- Middleware de autenticación aplicado a **todas** las rutas `/admin`
- No almacenar JWT en `localStorage` (usar `httpOnly cookie` o memoria)
- Contraseña del admin hasheada con `bcrypt` (nunca en texto plano)

### 5. 🌐 Cabeceras HTTP de Seguridad

- `helmet()` instalado y configurado
- CORS restringido a los dominios reales (no `*` en producción)
- Content Security Policy que bloquee scripts externos no autorizados

### 6. 🔒 Cifrado de Datos de Contacto

- AES-256 aplicado correctamente (IV aleatorio por cifrado, nunca reutilizado)
- Clave de cifrado en variable de entorno, nunca hardcodeada
- Datos descifrados solo en el panel admin autenticado

### 7. 📅 Seguridad de Google Calendar (OAuth2)

- Tokens de refresco almacenados cifrados, no en texto plano
- Scopes de OAuth mínimos necesarios (solo `calendar.events`)
- Manejo de error cuando el token caduca (renovación automática)

### 8. 💥 Manejo de Errores y Robustez

- Nunca exponer stack traces al cliente en producción
- Todos los `await` dentro de `try/catch`
- Respuestas de error estandarizadas: `{ error: "Mensaje amigable" }`
- Middleware global de errores en `server.js`
- La app no cae si la API de Anthropic tarda o falla (timeout + fallback)

---

## Fase 2 — Informe de Auditoría

Genera un informe con esta estructura exacta:

```markdown
# 🔍 Informe de Seguridad — Onda Vital
Fecha: [fecha actual]

## Resumen Ejecutivo
[2-3 frases: estado general de la app, riesgo principal, prioridad de acción]

## 🔴 Crítico (corregir antes de publicar)
[Lista de problemas graves con código de corrección]

## 🟡 Importante (corregir pronto)
[Lista de mejoras de seguridad recomendadas]

## 🟢 Preventivo (buenas prácticas)
[Lista de refuerzos opcionales pero recomendados]

## ✅ Checklist de Producción
[Lista de verificación antes de hacer deploy]
```

---

## Fase 3 — Correcciones de Código

Para cada problema encontrado, entrega el código corregido listo para copiar.

Lee `references/security-checks.md` para las implementaciones de referencia de:

- Middleware de validación con `express-validator`
- Configuración de `express-rate-limit`
- Setup de `helmet` con CSP para Onda Vital
- Patrón correcto de AES-256 con IV aleatorio
- Middleware de errores global
- Wrapper de timeout para llamadas a Anthropic API

---

## Fase 4 — Dependencias de Seguridad

Genera un `package.json` actualizado con estas dependencias de seguridad si no están ya:

```json
{
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "express-validator": "^7.0.1",
  "bcryptjs": "^2.4.3"
}
```

Y ejecuta siempre:

```bash
npm audit
```

Muestra al usuario si hay vulnerabilidades conocidas en las dependencias actuales.

---

## Checklist Final de la Auditoría

- [ ] Las 8 áreas revisadas
- [ ] Informe generado con clasificación 🔴🟡🟢
- [ ] Código de corrección entregado para cada problema crítico
- [ ] `package.json` actualizado con dependencias de seguridad
- [ ] Checklist de producción incluida
- [ ] Explicación en lenguaje no técnico del riesgo de cada vulnerabilidad
- [ ] Todo en español

---

## Referencia

Ver `references/security-checks.md` para implementaciones completas de cada corrección.
