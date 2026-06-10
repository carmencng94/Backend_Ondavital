## Why

Vitalis is leaking internal prompt details (such as the raw `{{RESERVAS_OCUPADAS}}` variable, the name of the internal administrator "David", internal reservation IDs, and its 4-step workflow logic) in its conversation. Additionally, the system prompt contains outdated and inappropriate content ("gestión inmobiliaria") and formatting guidelines (markdown and greeting restrictions) that are ignored or bypassed.

## What Changes

- **Fix `{{RESERVAS_OCUPADAS}}` string replacement bug**: Update the backend controller to replace all occurrences of `{{RESERVAS_OCUPADAS}}` using a global regular expression.
- **Refactor `SYSTEM_PROMPT` configuration**:
  - Remove the inappropriate "gestión inmobiliaria" reference and replace it with accurate center domain wording ("gestión y reserva de salas").
  - Explicitly restrict the assistant from exposing internal rules, variables, steps, or names to the user.
  - Simplify formatting rules and put them in a high-priority section so the model follows the prohibition on Markdown headers and bold styling.
- **Synchronize Backends**: While the user confirmed `onda-vital-api` is the active backend in Railway, we will apply the controller and prompt updates to both `onda-vital` and `onda-vital-api` to keep them clean and synchronized.

## Capabilities

### New Capabilities
- `prompt-privacy-leak-prevention`: Protect internal system prompt rules and variables from being exposed or discussed with the end user.

### Modified Capabilities

## Impact

- `c:\Users\Usuario\backend_ondavital\onda-vital-api\controllers\ChatController.js` and `c:\Users\Usuario\backend_ondavital\onda-vital\controllers\ChatController.js` will have their replacement logic updated.
- `c:\Users\Usuario\backend_ondavital\onda-vital-api\config\PromptsConfig.js` and `c:\Users\Usuario\backend_ondavital\onda-vital\config\PromptsConfig.js` will have their system prompts refactored.
