## Why

Currently, clicking the "Ver disponibilidad" button on room cards opens the Vitalis chat instead of the expected booking calendar. This causes confusion. Additionally, when the chat window opens on mobile devices, the room detailed modal stays open on top of it, creating a z-index stacking conflict that blocks the user from viewing or closing the chat window.

## What Changes

- **Double-Button Layout on Room Cards**: Add two distinct buttons to the footer of room cards: "Reservar (Calendario)" (opens the modal with the booking calendar) and "Preguntar a Vitalis" (opens the chat widget with the custom inquiry).
- **Auto-Dismiss Room Modals**: Automatically close any active room detail modal when the chat assistant is opened via the "Preguntar a Vitalis" click event.
- **Translation Keys**: Introduce translation keys for these new button labels in Spanish, English, German, and Catalan.

## Capabilities

### New Capabilities
- `salas-ux-improvements`: Specification of the user interaction flow for room details, calendar bookings, and AI assistant inquiries.

### Modified Capabilities
<!-- None -->

## Impact

- **Affected Code**: Frontend Javascript components and translation assets.
- **Affected Files**: `i18n.js`, `SalasSection.js`, and `ChatWidget.js`.
- No backend API or database impact.
