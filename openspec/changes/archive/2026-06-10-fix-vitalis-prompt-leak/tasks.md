## 1. Backend Controller Updates

- [x] 1.1 Replace single string `.replace()` with global regex replacements for `{{RESERVAS_OCUPADAS}}` in `onda-vital-api/controllers/ChatController.js`.
- [x] 1.2 Replace single string `.replace()` with global regex replacements for `{{RESERVAS_OCUPADAS}}` in `onda-vital/controllers/ChatController.js` (for synchronization).

## 2. Prompt Configuration Updates

- [x] 2.1 Update role identity in `onda-vital-api/config/PromptsConfig.js` to remove "gestión inmobiliaria" and replace it with "gestión y reserva de salas".
- [x] 2.2 Add explicit Privacy Guardrails section in `onda-vital-api/config/PromptsConfig.js` to prevent leakage of internal system prompt rules, steps, variables, and names.
- [x] 2.3 Optimize layout and placement of format guidelines in `onda-vital-api/config/PromptsConfig.js` to reinforce Markdown and greeting prohibitions.
- [x] 2.4 Replicate all prompt configuration improvements to `onda-vital/config/PromptsConfig.js` to keep the codebase synchronized.

## 3. Verification & Testing

- [x] 3.1 Run local chat tests using existing scratch test scripts (like `onda-vital-api/scratch/test-chat.js` or `test_e2e_chat.js`) to verify no runtime issues.
- [x] 3.2 Perform manual simulation of the query "Ola que puedes hacer por mí?" and check that the response conforms to formatting rules (no Markdown headers, no literal `{{RESERVAS_OCUPADAS}}`, and no technical workflow details leak).
