## Context

The Onda Vital Holistic website is a custom-built Single Page Application (SPA) written in Vanilla HTML and ES module Javascript components.
Styling is handled via:
1. A global stylesheet `public/src/styles/global.css`.
2. Encapsulated style blocks within individual component JS files (`public/src/components/`).
3. Inline styles on HTML nodes defined programmatically.

Due to the mix of styling techniques, some components have fixed sizes or rigid CSS properties that break when rendered on mobile screens (< 600px).

## Goals / Non-Goals

**Goals:**
- Eliminate all horizontal overflow on screens down to 320px wide.
- Stack all multi-column layouts vertically when viewport width is < 600px.
- Adjust excessively large font sizes (e.g. CTA phone numbers) and container paddings (e.g. AI Card) on mobile.
- Make the Rates selection card grid in the booking module stack vertically on mobile.
- Decrease time-slot column count from 4 to 3 on viewports < 480px.

**Non-Goals:**
- Changing site branding, colors, or typography families.
- Restructuring logic, API endpoints, or database tables.
- Rewriting the admin dashboard styling (as it is out of scope of the public reservation portal).

## Decisions

### Decision 1: Use Component-Level CSS Media Queries
- **Option A**: Centralize all responsive rules in `global.css`.
- **Option B (Chosen)**: Add responsive CSS media queries inside the style blocks of each respective component JS file (e.g., `QuiropracticaSection.js`, `HomeSection.js`, etc.).
- **Rationale**: Since the application injects styles per component dynamically, keeping the media queries next to the class definitions in the respective JS files maintains encapsulation and readability.

### Decision 2: Remove Hardcoded Inline Styles
- **Option A (Chosen)**: Replace programmatic inline style values (e.g. `gridTemplateColumns: '1fr 1fr'`) with responsive CSS class rules.
- **Option B**: Override inline styles using `!important` in CSS selectors.
- **Rationale**: Programmatic inline styles are hard to manage and override cleanly. Replacing them with class names (e.g., `.about-info-grid`) is the industry standard for clean styling.

## Risks / Trade-offs

- **[Risk] Style overriding conflicts** → Mitigation: Ensure selector specificity is maintained and test CSS class injection order so local styles take precedence over global styles.
- **[Risk] Horizontal text clip on Booking slots** → Mitigation: By changing the column repeat in `.slots-container` from `4` to `3` on very narrow screens (width < 480px), slots will have sufficient width to display times cleanly.
