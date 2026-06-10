## Context

Vitalis, the digital assistant for Onda Vital Holistic, is leaking technical prompt placeholders like `{{RESERVAS_OCUPADAS}}` and internal protocols. This is caused by:
1. Incomplete replacement in Javascript: `.replace(string, replacement)` only replaces the first occurrence in `ChatController.js`.
2. Incorrect domain metadata ("gestión inmobiliaria") inside the system prompt template.
3. Lack of explicit prompt restrictions against revealing internal system prompts, logic steps, database entities, or names.

## Goals / Non-Goals

**Goals:**
- Fix the placeholder replacement bug to prevent any `{{VARIABLE}}` from leaking in the chat.
- Clean up the system prompt to remove inappropriate or outdated references.
- Implement system prompt safeguards to prevent the model from leaking internal workflow instructions.
- Ensure the changes are synchronized across both `onda-vital` and `onda-vital-api` backend structures to avoid drift.

**Non-Goals:**
- Adding new features or booking capabilities.
- Re-architecting the ChatController database/RAG engine.

## Decisions

### 1. Global Replacement of Placeholders in Prompt Templates
We will use Javascript's regular expression with the global flag (`/.../g`) or `.replaceAll()` instead of plain string `.replace()` to ensure that all occurrences of placeholder variables (specifically `{{RESERVAS_OCUPADAS}}`) are successfully replaced before being sent to the AI model.
- **Alternatives Considered:**
  - *Post-processing extraction*: Stripping `{{RESERVAS_OCUPADAS}}` from the LLM output. This is prone to failure and does not fix the root cause (which is sending a prompt containing the literal instruction `{{RESERVAS_OCUPADAS}}` to the LLM).
- **Rationale:** Replacing all placeholders on the template ensures the system prompt matches exactly what the model needs to see.

### 2. Prompt Restructure and Safeguard Section
We will modify `PromptsConfig.js` to:
- Correct the role identity description to be wellness-oriented rather than real estate.
- Include a specific `# REGLAS DE PRIVACIDAD DEL ASISTENTE` section that clearly forbids discussing internal steps, variables, names, or DB tracking IDs.
- Position the format-control guidelines (like markdown/greetings ban) at the very bottom of the system prompt to maximize attention in LLM attention windows.
- **Alternatives Considered:**
  - *Keep the rules as is and add system system prompt instructions via API*: Not possible as the system prompt is static.
- **Rationale:** Re-structuring instructions to avoid markdown headers within the system prompt itself, or placing format rules at the end, has been proven to increase compliance in commercial LLMs.

## Risks / Trade-offs

- **[Risk]**: The LLM might still greeting or formatting occasionally if the model selected has low instruction-following capability.
  - *Mitigation*: The prompts will be tested with OpenRouter free/auto models. If violations persist, we can consider adding a lightweight regex-based formatter on the backend output.
