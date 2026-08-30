# Design - Lantaw

A locked design system for this app. Every page redesign reads this file before emitting code. Do not regenerate per page; extend this file when the system needs to grow.

## Genre
atmospheric

## Macrostructure Family
- Marketing and home discovery: Ecosystem Index with dense rails, real posters, and one featured title.
- App pages: Workbench with functional headers, filter controls, and direct result surfaces.
- Detail pages: Workbench with photographic title deck and compact cast/recommendation rails.

## Theme
- `--color-paper` dark midnight surface, with a light mode counterpart.
- `--color-ink` high-contrast cinema ink.
- `--color-accent` warm signal orange, used sparingly for active and primary actions.
- `--color-focus` warm amber ring for keyboard visibility.

## Typography
- Display: Bebas Neue, weight 400, style normal.
- Body: Manrope, weight 400.
- Wordmark: Bebas Neue, limited to brand marks and large title moments.
- Display letter spacing stays normal to lightly positive because Bebas Neue is condensed.

## Spacing
4-point named scale. CSS uses `--space-*` tokens for custom surfaces and Tailwind spacing only where it maps to the existing framework.

## Motion
- Easings: `--ease-out`, `--ease-in`, `--ease-in-out`.
- Reveal pattern: none for content rails; hover feedback only on interactive cards and controls.
- Reduced-motion fallback: spatial motion collapses to opacity-only within 150 ms.

## Microinteractions Stance
- Search is the primary action and stays visible in the nav.
- Success is silent; visible navigation/result updates are the confirmation.
- Buttons and cards use one hover signal only: colour shift or 1 px lift.

## CTA Voice
- Primary CTA: compact pill, action verb first, one-line label.
- Secondary CTA: outlined pill, one-line label.

## Per-page Allowances
- Marketing/home pages may use TMDB backdrop imagery because the product is visual discovery.
- App pages should not use decorative illustration or fake UI chrome.
- Detail pages may use real posters and backdrops, with no invented metadata.

## What Pages Must Share
- Lantaw wordmark and product naming.
- Warm accent placement under 5% per viewport.
- Bebas Neue display, Manrope body.
- Pill control shape and 44 px minimum touch targets.
- Unframed rails; cards are the only repeated framed items.

## What Pages May Differ On
- Home may lead with a featured title.
- Browse/search/list pages may lead with controls and result context.
- Detail pages may use a photographic deck.

## Exports

### tokens.css
See `tokens.css` at the project root.
