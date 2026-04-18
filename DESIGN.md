## Overview
A confident, industrial B2B interface for manufacturing optimization powered by AI.
The design should feel precise, trustworthy, and operationally serious, with clear hierarchy and fast scanability.
Prefer structured layouts, strong section framing, and concise, outcome-oriented messaging.
Accessibility-first design with WCAG AA contrast and keyboard-friendly interactions.

## Colors
- **Primary** (#0B5FFF): Primary CTAs, active states, selected tabs, and key decision points
- **Secondary** (#005B4A): Positive operational states, successful actions, and optimization gains
- **Tertiary** (#D97706): Warnings, risk indicators, and attention cues for quality incidents
- **Neutral** (#4B5563): Surfaces, borders, neutral text, and non-decorative UI structure

Use high-contrast neutrals for data-heavy views. Keep saturated colors for meaningful status and actions.

## Typography
- **Headline Font**: IBM Plex Sans
- **Body Font**: Source Sans 3
- **Label Font**: IBM Plex Sans

Headlines use semi-bold to bold weights for operational emphasis.
Body text uses regular weight at 15-16px for readability in dense enterprise screens.
Labels use medium weight at 12-13px and sentence case for clear system language.
Numeric metrics should align and remain highly legible at a glance.

## Elevation
Use subtle elevation only for modal layers and floating action surfaces.
Primary information architecture should rely on spacing, section boundaries, and contrast rather than heavy shadows.
Cards and data panels should use low-contrast borders with minimal or no drop shadows.

## Components
- **Buttons**: Primary filled for one main action per view; secondary outlined for alternatives; tertiary text for low-priority actions; 8px radius
- **Inputs**: 1px neutral border, high-focus ring in primary, clear helper/error text, generous vertical padding for form speed
- **Cards**: Data-oriented panels with 10-12px radius, subtle border, compact header zone, and stable internal spacing
- **Tables**: Dense but readable rows, sticky headers on long lists, clear sort states, and strong empty/loading/error patterns
- **Tabs / Section Nav**: Distinct active state, keyboard navigation support, and compact spacing for investigation workflows
- **Status Chips**: Standardized tones for critical/high/medium/low severity and open/in-progress/closed workflow states
- **Timeline Elements**: Clear event markers with type-specific iconography and concise metadata
- **Charts**: Analytical first; prioritize legibility over decoration; provide value labels, thresholds, and concise legends

## Do's and Don'ts
- Do keep one dominant CTA per screen section
- Do prioritize evidence readability over visual flourish in analytical views
- Do use consistent status semantics across cards, charts, and tables
- Do keep all key actions reachable without excessive scrolling
- Do maintain WCAG AA contrast ratios (4.5:1 for normal text)
- Don't overuse bright accent colors in dense operational dashboards
- Don't mix multiple corner radius systems in the same screen
- Don't use more than two primary font weights in a single panel
- Don't hide critical risk states behind hover-only interactions
- Don't present charts without clear labels and scale context
