# Stitch Design System — "Modern Trail Adventure"

Exported from project `8988882067203283510`.

## Fonts
- **Headlines/Body/CTA:** Lexend (wght 100-900)
- **Web3 labels:** Space Grotesk (wght 300-700)
- **Icons:** Material Symbols Outlined

## Color Palette (Material 3 based)
| Token | Value | Usage |
|---|---|---|
| primary | #154212 | Deep forest green — headers, text |
| primary-container | #2D5A27 | Buttons, badges, cards |
| tertiary | #5A2E00 | Warm brown accent |
| tertiary-container | #7B4100 | Safety Orange dark |
| Safety Orange (hardcoded) | #FF6B00 | CTA buttons, active states, gamification |
| background | #FCF9F8 | Earthy cream surface |
| surface | #FCF9F8 | Same as background |
| on-surface | #1B1B1C | Body text |
| on-surface-variant | #42493E | Secondary text |
| error | #BA1A1A | Errors |

## Typography Scale (Tailwind extend)
| Token | Size | Weight | Line Height |
|---|---|---|---|
| display-lg | 48px | 700 | 1.1 |
| headline-lg | 32px | 600 | 1.2 |
| headline-md | 24px | 600 | 1.3 |
| body-lg | 18px | 400 | 1.6 |
| body-md | 16px | 400 | 1.6 |
| label-web3 | 14px | 500 | 1.0 |
| cta-text | 16px | 700 | 1.0 |

## Spacing (8px base rhythm)
| Token | Value |
|---|---|
| xs | 4px |
| base | 8px |
| sm | 12px |
| gutter | 16px |
| md | 24px |
| lg | 40px |
| xl | 64px |
| container-margin | 20px |

## Border Radius
| Token | Value |
|---|---|
| DEFAULT | 0.25rem |
| lg | 0.5rem |
| xl | 0.75rem |
| full | 9999px |

## Layout
- Mobile-first, max-width: 480px centered
- Fixed top nav (h-16) + bottom nav (h-20)
- Content padded with `px-container-margin` (20px)
