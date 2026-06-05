## 1. Setup & Translations

- [x] 1.1 Add new dictionary translation keys (`salas_ask_vitalis` and `salas_more_info_reserve`) for Spanish, English, German, and Catalan inside i18n.js.

## 2. Core Implementation

- [x] 2.1 Update SalasSection.js card footer to display the two new buttons and style them with the primary and outline classes.
- [x] 2.2 Update SalasSection.js stylesheet definition to style the secondary card button and position both buttons side-by-side.
- [x] 2.3 Modify ChatWidget.js in the `consultar-sala` event listener to close any open `.modal-overlay` modals on the body before expanding the chat window.

## 3. Verification & Testing

- [x] 3.1 Verify that clicking the "Preguntar a Vitalis" button on a room card opens the chat and does not leave a room modal open.
- [x] 3.2 Verify that clicking "Reservar (Calendario)" opens the detailed room modal with the calendar booking grid correctly.
