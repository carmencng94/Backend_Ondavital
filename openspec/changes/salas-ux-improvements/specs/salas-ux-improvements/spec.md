## ADDED Requirements

### Requirement: Stacking Context Modal Dismissal
The system SHALL automatically dismiss/close any open room detailed modals when the chat assistant is triggered for a room inquiry.

#### Scenario: Auto-closing modal on chat trigger
- **WHEN** a user is viewing a room detailed modal and clicks a button to ask the assistant about the room
- **THEN** the room detailed modal SHALL close, and the Vitalis chat window SHALL open at the front of the screen.

### Requirement: Double Button Selection on Room Cards
The footer of each room card SHALL display two distinct primary call to actions: one for traditional calendar-based bookings and one for asking questions/checking availability via the Vitalis chat assistant.

#### Scenario: Room card actions display
- **WHEN** a user views a room card
- **THEN** the card footer MUST show a "Reservar (Calendario)" button and a "Preguntar a Vitalis" button side-by-side.

### Requirement: Clicking Card Body Opens Modal
The system SHALL support opening the room detailed modal when clicking any part of the room card body (excluding the specific Vitalis chat action button).

#### Scenario: Card click interaction
- **WHEN** a user clicks on the room card body (image or info text)
- **THEN** the room detailed modal with the booking calendar SHALL open.
