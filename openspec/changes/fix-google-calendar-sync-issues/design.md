## Context

The room reservation system integrates with Google Calendar to block time slots when the administrator (David) has personal events, and to sync confirmed room reservations.

Currently, this integration has two main flaws:
1. **Global Room Blocking**: The system queries Google Calendar availability using `freebusy.query`. This API is designed to return blind time blocks (start/end) without any metadata for privacy. Consequently, once a booking is confirmed for one room (e.g. "Despacho +") and synced to Google Calendar, it appears as a busy block. During subsequent availability checks for *other* rooms (e.g. "Sala Luz"), the system detects this block and marks the time slot as busy. This prevents rooms from being booked simultaneously.
2. **Gray/Translucent Events**: Events created by the service account are inserted directly into David's calendar. Since the service account is the organizer, Google Calendar treats David as an invitee with a pending response (`needsAction`), which displays the event as gray, faded, or translucent in the Google Calendar interface until he manually accepts it.

## Goals / Non-Goals

**Goals:**
- Enable simultaneous bookings of different rooms at the same time by preventing synchronized Onda Vital events from blocking other rooms.
- Make synchronized Google Calendar events appear in full color (confirmed/accepted) immediately upon creation or update.
- Remove duplicate entries for synchronized reservations under "Calendario de David" in the global calendar view.

**Non-Goals:**
- Changing local SQLite database schema or validation.
- Modifying frontend layout or styling.
- Changing how David's personal events block all room availability.

## Decisions

### Decision 1: Query events list instead of freebusy intervals

We will query Google Calendar events using `calendar.events.list` instead of `freebusy.query`.

- **Rationale**: The `events.list` method returns full event resources, including `extendedProperties`. This allows the server to identify events created by Onda Vital (`extendedProperties.private.origin === 'ondavital'`) and ignore them when checking Google Calendar availability.
- **How it works**:
  - Local database checks already block the specific room reserved for Onda Vital bookings.
  - Google Calendar queries will only return busy times for events that are *not* created by Onda Vital (i.e. David's personal events).
  - These personal events will continue to block all rooms globally.
- **Alternatives considered**:
  - Sharing separate calendars for each room. This would require configuring and maintaining multiple calendar IDs in the `.env` file, increasing setup complexity for the user. Filtering by metadata is much simpler and uses a single calendar.

### Decision 2: Set owner responseStatus to 'accepted' and sendUpdates to 'none'

When creating or updating events via the API, we will include the calendar owner (`calendarId`) as an attendee.

- **Rationale**: Setting `attendees` with `email: this.calendarId` and `responseStatus: 'accepted'` forces Google Calendar to confirm the owner's attendance immediately, making the event show up in full color.
- **Notification Suppression**: We will set the query parameter `sendUpdates: 'none'` during event creation/update. This stops Google Calendar from sending email notifications to the owner about the new/updated event.
- **Alternatives considered**:
  - Domain-wide delegation of authority. This would allow the service account to impersonate David directly. However, it requires a Google Workspace admin account, which may not be available or is too complex to set up. Specifying the attendee response status is client-side simple and works with standard Gmail accounts.

## Risks / Trade-offs

- **[Risk] Quota and performance of events.list** → `events.list` consumes slightly more API quota than `freebusy.query` and could have slightly higher latency.
  - *Mitigation*: We restrict queries to specific date ranges (`timeMin` and `timeMax`) to fetch only relevant events. Since the volume of events per day is low, the latency impact will be negligible.
- **[Risk] Sincronización bidireccional (Webhook) Loop** → The webhook handler `handleCalendarWebhook` updates local bookings when Google Calendar events change.
  - *Mitigation*: The webhook already has loop protection by checking if the event was modified before writing to the database. We will ensure this logic remains unaffected.
