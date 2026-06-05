## ADDED Requirements

### Requirement: Layout Adaptation on Mobile Viewports
The website's user interface MUST dynamically adapt to viewports down to 320px in width without causing horizontal overflow on the root document level.

#### Scenario: Mobile viewport sizing
- **WHEN** a user views the website on a viewport width between 320px and 600px
- **THEN** all columns, grids, and dialogs MUST fit within the viewport width without clipping or overflowing horizontally.

### Requirement: Stacking of Column Layouts
The website's multi-column grids (such as the chiropractic grid, about page info-grid, and booking engine rate selector) MUST stack vertically on mobile viewports.

#### Scenario: Stacking columns on mobile
- **WHEN** a viewport width is less than 600px
- **THEN** the chiropractic grid, about page schedules, and rate selector options MUST be displayed in a single-column stacked format.

### Requirement: Readable Mobile Typography and Spacing
The typography and container padding MUST scale down proportionally on viewports < 600px to maximize reading space and usability.

#### Scenario: Scaling text and padding on small screens
- **WHEN** a viewport width is less than 600px
- **THEN** the card paddings are reduced to 16px (var(--space-md)) and the CTA phone number is styled with a smaller readable font size.
