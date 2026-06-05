## Context

The room cards catalog inside `public/src/components/SalasSection.js` renders a footer containing a "Ver disponibilidad" button. When clicked, it dispatches the `consultar-sala` event to the `ChatWidget.js` component to initiate a room inquiry. However:
1. "Ver disponibilidad" usually indicates calendar availability. Users clicking it expect to see a calendar booking form, but instead see the chat assistant.
2. The detailed room modal has a high z-index stacking context on mobile viewports which completely covers and disables the chat window, preventing the user from interacting with or closing the chat window properly.

## Goals / Non-Goals

**Goals:**
- Present two separate and clear buttons in the card footer: one to open the detailed modal calendar, and one to consult the AI assistant.
- Automatically dismiss any active room modals when the chat widget is activated.
- Introduce multilingual dictionary keys for the new buttons.

**Non-Goals:**
- Redesigning the interior layout of the room detailed modal itself.
- Changing database schemas or reservation backend REST APIs.

## Decisions

### Decision 1: Auto-dismiss Room Modals on Chat Trigger
- **Option A (Chosen)**: Add modal dismissal logic inside `ChatWidget.js` in the `consultar-sala` event handler.
- **Option B**: Pass close callbacks from `SalasSection.js` directly to `ChatWidget`.
- **Rationale**: Option A is clean and highly decoupled. Modals are appended directly to `document.body` as `.modal-overlay`, so querying and dismissing them from the global event handler is simple and requires zero structural changes in component hierarchy.

### Decision 2: Redesign Card Footer Styling
- **Option A (Chosen)**: Use `display: flex; gap: var(--space-xs);` on the footer to display two equally-sized buttons side-by-side. Update `.btn-check-availability` to draw emphasis on the AI assistant by styling it as a solid primary button, while styling the calendar booking button as an outline (`.secondary-btn`).
- **Option B**: Display the buttons vertically stacked.
- **Rationale**: Horizontal side-by-side placement fits nicely on desktop and fits well on mobile since we will decrease the font-size to `0.8rem` and use compact padding.

## Risks / Trade-offs

- **[Risk] Styling collision on very narrow screens** → Mitigation: Use CSS `flex: 1` and `white-space: nowrap` combined with small font sizes to keep buttons aligned side-by-side without overflowing the card container.
