# StartupTeen Feedback Design Strategy

## Design Strategy

The interface is structured as a focused operational SaaS workflow: tutors complete one decision at a time, while admins review results in a dense dashboard. This fits the project because feedback submission is repetitive, time-sensitive, and accuracy-sensitive after each session.

The iSchool brand direction influenced the system through blue as the dominant product color, orange as the supporting action/accent color, and yellow as a sparse highlight. White product surfaces, rounded geometry, restrained shadows, clear hierarchy, and a modern education-product tone are used throughout. The brand reference URL was not directly readable from this environment, so the implementation follows the visible iSchool app language, supplied color-role screenshot, and the requirements provided in the brief.

The provided StartupTeen logo is used as the primary product identity in the header and first-viewport progress panel.

## Component Mapping

- App header: product identity, primary navigation, admin entry
- Stepper/progress rail: wizard position, completion state, mobile horizontal behavior
- Form fields: labeled inputs, selects, date picker, text areas, validation states
- Checklist cards: repeated deliverable assessment with segmented completion controls
- Score sliders: 1 to 10 rating inputs with live summary
- Upload panel: document/image upload with selected-file feedback
- Success state: confirmation, generated submission ID, repeat action
- Admin metrics: total count, average score, top team, attention count
- Admin filters: school, tutor, group, team, session, date range
- Data table: submissions, file links, recommendations, score summary
- Export actions: CSV and Excel downloads

## UX Structure

The tutor flow uses a seven-step wizard:

1. Tutor information
2. Team information
3. Session information
4. Dynamic deliverables checklist
5. Team scores
6. Feedback text or upload
7. Final recommendation and explicit submit

The final page does not auto-submit. It acts as a final review checkpoint and only saves when the tutor presses **Submit Feedback**.

The admin flow prioritizes scanning:

- High-level metrics first
- Filters second
- Comparison analytics third
- Full submission table last

## Responsive Behavior

- Desktop: two-column tutor layout with progress rail and large content panel
- Tablet/mobile: progress rail becomes horizontally scrollable, content stays single-column
- Admin tables use horizontal scrolling to preserve readable columns
- Touch targets use comfortable button and field sizing

## States And Feedback

- Required field errors are shown inline in the wizard panel
- Loading state disables submission and shows a spinner
- Success state shows the submission ID
- Empty admin tables show a clear empty state
- Hover and focus states use blue primary rings with orange supporting accents

## Design System Compliance Report

The implementation follows the requested iSchool SaaS direction by using:

- Blue as the dominant 60% product color
- Orange as the 30% supporting accent color
- Yellow as the 10% highlight color
- White cards and clean dashboard surfaces
- Rounded inputs, cards, controls, and buttons
- Soft shadows with minimal visual noise
- Clear typographic hierarchy
- Accessible labels and semantic form controls
- Keyboard-focus rings for interactive fields
- Motion only for wizard transitions and progress feedback
- Config-driven content for schools and session deliverables

The code avoids random third-party styling patterns and keeps reusable UI patterns in components, config files, and shared helpers so the app can scale cleanly.
