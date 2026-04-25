# Trepacerros — Quirurgica Redesign Complete

## DMLABS — Monad Blitz GDL 2026
**Branch:** `feat/claude-design-redesign`
**Preview:** Vercel auto-deploys from branch push

---

## Commits (latest first)

| Hash | Description |
|---|---|
| `684c83f` | Profile + Leaderboard exact match |
| `ee3a00d` | 6 pages exact match (Dashboard, Hike, Wiki, Routes, Marketplace) |
| `8d2a897` | Shell: CSS vars from HTML, Sidebar, BottomNav, dark mode |
| `1299ebd` | Polish: counter-up, toasts, confetti, color-mix fallback |
| `56175eb` | Previous page migration (superseded) |
| `0e7ee58` | Foundation: fonts, palette |

---

## Pages migrated

| Page | Route | Status | CSS classes used | Hooks wired |
|---|---|---|---|---|
| Landing | `/` (unauth) | ✅ | .h-display, .mtn-hero, .hex-stamp, .eyebrow, .btn-primary, .card | usePrivy.login |
| Dashboard | `/` (auth) | ✅ | .stat, .quest-card, .progressbar, .chip, .h-section, .card | usePrimaBalance, useHikerStats, useUserNFTs, useCountUp |
| Hike (3 states) | `/hike` | ✅ | .hud-num, .pickbar, .live-tag, .pulse-dot, .buddy, .chip, .btn-primary/danger | useHikeTracker, useGPSValidation, HikeMap, SubmitHike |
| Marketplace | `/rewards` | ✅ | .mp-card, .mp-photo, .price, .hscroll, .chip, .lb-row | useRewardsList, useRedeemReward, useApprovePrima, useToast |
| Profile | `/profile` | ✅ | .avatar-cd, .rank-pill, .badge-cd, .ledger-row, .ledger-amt, .chip-moss | usePrimaBalance, useHikerStats, useUserNFTs, useUserRedemptions, useCountUp |
| Leaderboard | `/profile/leaderboard` | ✅ | .seg, .lb-row, .lb-rank, .lb-avatar, .lb-meta, .avatar-cd | useHikerStats (mock data for others) |
| Wiki | `/wiki` | ✅ | .wiki-icon, .mult-badge, .search, .hscroll, .chip, .h-display | data/trashTypes.ts |
| Route Select | `/hike/select` | ✅ | .search, .card, .chip, .eyebrow, .btn-primary | data/cerros.ts |
| Gallery | `/gallery` | ⚠️ | Not redesigned | useUserNFTs |

## Design system

### CSS approach
- **CSS custom properties** (var(--ink), var(--ember), etc) — NOT Tailwind utility classes for colors
- **Dark mode** via `[data-theme="dark"]` with oklch color overrides
- **55+ CSS classes** ported verbatim from Claude Design HTML
- **Minimal Tailwind** used only for layout (flex, grid, gap)

### Typography
| Role | Font | Usage |
|---|---|---|
| Display | Big Shoulders Display | Headlines, brand, stamps |
| UI body | Lexend (via Inter fallback) | Body text, labels |
| Data/mono | JetBrains Mono | Numbers, hashes, coordinates, stats |

### Colors (CSS vars, oklch)
| Token | Light | Dark |
|---|---|---|
| --bg | oklch(0.975 0.012 90) | oklch(0.18 0.02 150) |
| --ink | oklch(0.22 0.045 150) | oklch(0.96 0.012 90) |
| --ember | oklch(0.68 0.18 50) | oklch(0.74 0.18 55) |
| --moss | oklch(0.42 0.09 150) | oklch(0.78 0.09 150) |
| --paper | oklch(0.99 0.008 90) | oklch(0.24 0.025 150) |

## Dark mode
- Toggle in Sidebar (desktop) — "Modo oscuro" button
- Persisted in localStorage
- Respects `prefers-color-scheme` on first visit
- All pages support dark mode via CSS vars

## Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | ✅ Clean |
| `pnpm build` | ✅ Passes |
| 9/9 routes 200 | ✅ All pass |
| Shared JS | 89.2 KB |
| Pushed to origin | ✅ `feat/claude-design-redesign` |

## Known bugs

1. **Gallery** (`/gallery`) not redesigned — old styling
2. **Daily challenges** are static placeholder data (no hook)
3. **Leaderboard** uses mock data (no multi-user hook)
4. **Weather chips** on Dashboard are hardcoded (no weather API)
5. **Level/XP system** is cosmetic (320/500 XP hardcoded)
6. **Depositar/Retirar** buttons on Profile are non-functional
7. **`color-mix()`** used in several places — Chrome 111+ only
8. **Community impact** stats on Dashboard are hardcoded
9. **Nearby trails** on Dashboard are static (not from GPS)
10. **oklch()** colors require modern browser (Chrome 111+, Safari 15.4+, Firefox 113+)

## What was NOT done

- [ ] Page transitions (framer-motion AnimatePresence) — risky for stability
- [ ] Shimmer skeleton loading states
- [ ] PWA manifest
- [ ] SEO og:image
- [ ] Gallery page redesign
- [ ] Real weather API integration
- [ ] Real XP/level calculation
- [ ] Mobile-only dark mode toggle (only in sidebar currently)

## What to test first when Damian wakes up

1. **Open preview URL** — verify Landing page loads with dawn gradient + hex stamps
2. **Connect wallet** — verify $CERRO balance appears in wallet chip
3. **Navigate all tabs** — verify 5-tab bottom nav works on mobile
4. **Toggle dark mode** — click "Modo oscuro" in sidebar (desktop only)
5. **Start a hike** — verify GPS tracking + HUD stats
6. **Check Marketplace** — verify rewards load and filter chips work
7. **Profile** — verify avatar, badges, on-chain activity
8. **Leaderboard** — verify podium + ranked list
