## Why

The current website layout has several responsiveness issues on mobile viewports (widths < 600px). Text wraps awkwardly, layouts overflow horizontally, and navigation and booking controls become squished and hard to click. Ensuring a seamless mobile experience is critical for client booking conversions and user satisfaction.

## What Changes

- **Chiropractica CTA Size Adjustments**: Scale down the Chiropractic phone number font size and reduce button/container margins on mobile screens.
- **Responsive Layout for About Us Schedule**: Replace the rigid inline grid display of the schedule block with a media-query-based layout that stacks on mobile.
- **Home AI Card Padding Reduction**: Reduce excessive padding inside the AI card container and hero glass card on small devices.
- **Squeezed Booking Engine Controls**: Shift the Rates grid flex layout and Slots grid columns to a mobile-optimized layout (vertical rates stack, 3-column slots) on small screens.
- **Modal Display Optimizations**: Adjust carousel heights and modal paddings on mobile.

## Capabilities

### New Capabilities
- `mobile-responsiveness`: Specification of supported mobile viewports (320px to 768px) and layout behavior for all primary components.

### Modified Capabilities
<!-- None -->

## Impact

- **Affected Code**: Frontend Javascript components and global styling.
- **Affected Files**: `QuiropracticaSection.js`, `AboutSection.js`, `HomeSection.js`, `BookingGrid.js`, `SalasSection.js`, and `global.css`.
- No API, database schema, or environment configuration impact.
