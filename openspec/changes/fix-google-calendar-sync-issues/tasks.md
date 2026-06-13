## 1. Google Calendar Service Update

- [x] 1.1 Add the `getPersonalBusyPeriods(timeMin, timeMax)` method in `GoogleCalendarService.js` to query calendar events and filter out Onda Vital bookings (using the `origin` private property).
- [x] 1.2 (Cancelled) Adding attendees is not supported by service accounts without Domain-Wide Delegation. Reverted attendee list.
- [x] 1.3 Add `sendUpdates: 'none'` to the `calendar.events.insert` and `calendar.events.update` requests in `GoogleCalendarService.js` to suppress any notifications.

## 2. Integration with Availability and Controller Logic

- [x] 2.1 Replace `checkBusyPeriods` with `getPersonalBusyPeriods` in `AvailabilityService.js` to prevent Onda Vital reservations from triggering a global room block.
- [x] 2.2 Replace `checkBusyPeriods` with `getPersonalBusyPeriods` in `ReservaController.getDisponibilidadSlots` to prevent booking grid slots from being blocked globally.
- [x] 2.3 Replace `checkBusyPeriods` with `getPersonalBusyPeriods` in `ReservaController.getDisponibilidadGlobal` to avoid duplicate calendar blocks in the global overview.

## 3. Verification

- [x] 3.1 Verify that confirming a reservation for a room (e.g. Despacho +) blocks only that specific room locally, and other rooms remain available.
- [x] 3.2 Verify that a personal event on Google Calendar (without `origin: ondavital` property) successfully blocks all rooms globally.
- [x] 3.3 Verify that newly created synchronized events in Google Calendar appear as solid/confirmed (accepted) and do not show up as gray/translucent.
