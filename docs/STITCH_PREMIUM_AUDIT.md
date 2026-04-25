# Trepacerros — Stitch Premium UI Audit

## DMLABS — Monad Blitz GDL 2026

Branch: `feat/ola4-stitch-premium` | Tag: `pre-stitch-premium`
Stitch Project: `8988882067203283510` (Remix of Trepacerros Gamified Trail Cleaning)
14 screens analyzed: 7 mobile (780px) + 7 web (2560px)

---

## 1. Tokens nuevos detectados

### 1.1 Colors — Material 3 Palette (from Stitch tailwind.config)

All 14 screens share the **identical** M3 color palette. Key mapping to our project:

**IMPORTANT — primary color clarification:**
- `tc-primary` in tailwind.config.js = `#154212` (deep forest green from M3 seed)
- Legacy `primary` (non-tc) in tailwind.config.js = `#2A5C3E` (Trepacerros brand green, used in old Rastros palette)
- Stitch Premium uses `#154212` as `primary` (confirmed identical across all 14 screens)
- The `#2A5C3E` brand green is **not a primary** in M3 terms — it maps closest to `tc-primary-container` (`#2d5a27`)
- **Decision:** Keep `tc-primary: #154212`. The brand green `#2A5C3E` is retained in legacy `primary` for backward compat but is NOT used in Stitch Premium screens.
- Hardcoded uses of `#2D5A27` (sidebar logo, hero illustration) serve as the visible "brand green" — this IS the `primary-container` token.

| Token (Stitch) | Hex | Current equivalent | Action |
|---|---|---|---|
| `primary` | `#154212` | `tc-primary` ✅ same | Keep |
| `primary-container` | `#2d5a27` | `tc-primary-container` ✅ same | Keep |
| `on-primary-container` | `#9dd090` | `tc-on-primary-container` ✅ same | Keep |
| `primary-fixed` | `#bcf0ae` | `tc-primary-fixed` ✅ same | Keep |
| `primary-fixed-dim` | `#a1d494` | `tc-primary-fixed-dim` ✅ same | Keep |
| `surface` | `#fafaf4` | `tc-surface` mapped to `#fcf9f8` | **UPDATE** to `#fafaf4` |
| `surface-container` | `#eeeee9` | `tc-surface-container` `#f0eded` | **UPDATE** to `#eeeee9` |
| `surface-container-low` | `#f4f4ee` | `tc-surface-container-low` `#f6f3f2` | **UPDATE** to `#f4f4ee` |
| `surface-container-high` | `#e8e8e3` | `tc-surface-container-high` `#eae7e7` | **UPDATE** to `#e8e8e3` |
| `surface-container-highest` | `#e3e3de` | `tc-surface-container-highest` `#e5e2e1` | **UPDATE** to `#e3e3de` |
| `surface-container-lowest` | `#ffffff` | same | Keep |
| `on-surface` | `#1a1c19` | `tc-on-surface` `#1b1b1c` | **UPDATE** to `#1a1c19` |
| `on-surface-variant` | `#42493e` | `tc-on-surface-variant` ✅ same | Keep |
| `outline` | `#72796e` | `tc-outline` ✅ same | Keep |
| `outline-variant` | `#c2c9bb` | `tc-outline-variant` ✅ same | Keep |
| `tertiary` | `#642600` | `tc-tertiary` `#5a2e00` | **UPDATE** to `#642600` |
| `tertiary-container` | `#893600` | `tc-tertiary-container` `#7b4100` | **UPDATE** to `#893600` |
| `on-tertiary-container` | `#ffb08a` | `tc-on-tertiary-container` `#ffb272` | **UPDATE** to `#ffb08a` |
| `error` | `#ba1a1a` | `tc-error` ✅ same | Keep |
| `secondary` | `#5e604d` | `tc-secondary` ✅ same | Keep |
| `background` | `#fafaf4` | N/A | **ADD** alias for `surface` |

**New colors to ADD (not in current config):**

| Token | Hex | Usage |
|---|---|---|
| `surface-tint` | `#3b6934` | Tinted overlays |
| `surface-dim` | `#dadad5` | Disabled surfaces |
| `surface-bright` | `#fafaf4` | Bright mode surfaces |
| `surface-variant` | `#e3e3de` | Variant surface areas |
| `on-background` | `#1a1c19` | Text on background |
| `inverse-surface` | `#2f312e` | Dark surface inverse |
| `inverse-on-surface` | `#f1f1ec` | Text on inverse surface |
| `inverse-primary` | `#a1d494` | Primary on dark |
| `on-primary-fixed` | `#002201` | Darkest primary |
| `on-primary-fixed-variant` | `#23501e` | Dark primary variant |
| `secondary-fixed` | `#e4e4cc` | Fixed secondary |
| `secondary-fixed-dim` | `#c8c8b0` | Dim secondary |
| `on-secondary-fixed` | `#1b1d0e` | Text on secondary fixed |
| `on-secondary-fixed-variant` | `#474836` | Text variant on secondary |
| `tertiary-fixed` | `#ffdbcc` | Fixed tertiary |
| `tertiary-fixed-dim` | `#ffb693` | Dim tertiary |
| `on-tertiary-fixed` | `#351000` | Text on tertiary fixed |
| `on-tertiary-fixed-variant` | `#7a3000` | Text variant on tertiary |
| `brand-orange` | `#FF6B00` | Primary CTA color (keep as-is, already `tc-orange`) |
| `safety-orange` | `#ff5c00` | Alt CTA (used in 2 Stitch screens only — normalize to `#FF6B00`) |

**Brand orange audit — `#FF6B00` is canonical:**
- `tailwind.config.js` line 59: `tc-orange: '#FF6B00'` ✅
- Codebase: **52 occurrences** of `#FF6B00` across all `.tsx`/`.ts` files (app/, components/)
- Zero occurrences of `#ff5c00` or `#FF5A00` or `#FF6D00` in project code
- Stitch screens: `#ff5c00` appears in only 2 of 14 screens (marketplace, tracking) — these are Stitch artifacts, NOT our code
- **Decision:** `#FF6B00` is the single canonical brand orange. All Stitch `#ff5c00` references will be normalized to `#FF6B00` during migration. No other orange hex enters the codebase.

### 1.2 Typography (unified — final font assignments)

Stitch uses Lexend only. We keep our 3-font stack (Fraunces/Lexend/Space Grotesk) for stronger visual hierarchy, mapping each token to the appropriate font.

| Token | Size | LH | Weight | Spacing | Font (FINAL) | Usage | Current equiv |
|---|---|---|---|---|---|---|---|
| `display-lg` | 48px | 1.1 | 700 | -0.02em | **Fraunces** | Hero titles, landing page "TREPACERROS" | `tc-display` ✅ |
| `headline-lg` | 32px | 1.2 | 600 | -0.01em | **Fraunces** | Page titles (Dashboard, Profile, Wiki) | `tc-headline-lg` ✅ |
| `headline-md` | 24px | 1.3 | 600 | — | **Fraunces** | Section titles, card headers, modal titles | `tc-headline-md` ✅ |
| `body-lg` | 18px | 1.6 | 400 | — | **Lexend** | Body text, descriptions, challenge text | `tc-body-lg` ✅ |
| `body-md` | 16px | 1.6 | 400 | — | **Lexend** | Standard body, card descriptions, form text | `tc-body-md` ✅ |
| `label-bold` | 14px | 1.0 | 600 | 0.05em | **Space Grotesk** | Stat labels, nav items, badge text, web3 addresses | `tc-label-web3` — **UPDATE** weight 500→600 |
| `caption` | 12px | 1.4 | 500 | — | **Space Grotesk** | Timestamps, secondary metadata, helper text | **ADD** new token `tc-caption` |
| `cta` | 16px | 1.0 | 700 | — | **Lexend** | Button text, CTAs | `tc-cta` ✅ |

**Rationale:**
- **Fraunces** (serif) for display/headlines → distinctive personality, premium feel, hackathon differentiator
- **Lexend** (sans) for body/CTA → optimized for readability, Stitch-native
- **Space Grotesk** (monospace-adjacent) for labels/captions → technical authority for web3 data, wallet addresses, stat labels

### 1.3 Spacing

| Token | Value | Current equiv |
|---|---|---|
| `unit` | 4px | `tc-xs` ✅ same |
| `xs` | 0.5rem (8px) | `tc-base` ✅ same |
| `sm` | 1rem (16px) | `tc-gutter` ✅ same |
| `md` | 1.5rem (24px) | `tc-md` ✅ same |
| `gutter` | 1.5rem (24px) | alias for md |
| `lg` | 2.5rem (40px) | `tc-lg` ✅ same |
| `xl` | 4rem (64px) | `tc-xl` ✅ same |
| `margin-safe` | 2rem (32px) | **ADD** — safe area margin |

### 1.4 Border Radius

| Token | Value | Notes |
|---|---|---|
| `DEFAULT` | 0.25rem (4px) | Standard |
| `lg` | 0.5rem (8px) | Cards inner |
| `xl` | 0.75rem (12px) | Buttons, pills |
| `full` | 9999px | Circular |

Note: Stitch uses simpler radius scale than our current `rounded-2xl`/`rounded-3xl`. We keep our Tailwind defaults AND add these as overrides only where Stitch uses them.

### 1.5 Glass Morphism CSS Classes

| Class | Background | Blur | Border | Usage |
|---|---|---|---|---|
| `.glass-card` | `rgba(255,255,255,0.6)` | `blur(16px)` | `1px solid rgba(255,255,255,0.4)` + inset shadow | Cards on hero/map |
| `.glass-panel` | `rgba(255,255,255,0.4)` | `blur(20px)` | `1px solid rgba(255,255,255,0.2)` | Sidebar, large panels |
| `.glass-pill` | `rgba(255,255,255,0.7)` | `blur(20px)` | `1px solid rgba(255,255,255,0.1)` | Balance pill, nav pills |
| `.solid-card` | `white` or `surface` | none | `1px solid outline-variant` | List items, grid cards |

### 1.6 Shadows

| Name | Value | Usage |
|---|---|---|
| `shadow-premium` | `0 20px 40px rgba(45,90,39,0.1)` | Hero cards, profile |
| `inner-recess` | `inset 0 2px 4px rgba(0,0,0,0.05)` | Input fields, recessed areas |
| `glass-inset` | `inset 0 2px 4px rgba(0,0,0,0.02), 0 8px 32px rgba(45,90,39,0.05)` | Glass cards combined |

### 1.7 Special CSS

| Class | CSS | Usage |
|---|---|---|
| `.haptic-active:active` | `transform: scale(0.95); transition: transform 0.1s` | All tappable elements |
| `.gps-glow` | `filter: drop-shadow(0 0 8px #4ade80)` | GPS locked indicator |
| `.icon-fill` | `font-variation-settings: 'FILL' 1` | Active nav icon state |

---

## 2. Componentes a crear

| Componente | Path | Variantes | Usado en | Animaciones |
|---|---|---|---|---|
| `GlassCard` | `components/ui/GlassCard.tsx` | default, pill, panel | Dashboard, Tracking, Profile, Modals | fade-in on mount |
| `SolidCard` | `components/ui/SolidCard.tsx` | default, interactive | Wiki, Marketplace, Leaderboard | hover lift |
| `StatCard` | `components/StatCard.tsx` | vertical, horizontal | Dashboard, Profile, Tracking | counter-up animation |
| `CerroBalancePill` | `components/CerroBalancePill.tsx` | — | All routes (top-right fixed) | counter-up on change |
| `PrimaryButton` | `components/ui/PrimaryButton.tsx` | default, large, icon | All pages | haptic-active + glow |
| `SecondaryButton` | `components/ui/SecondaryButton.tsx` | default, outline | Modals, forms | haptic-active |
| `CategoryPill` | `components/ui/CategoryPill.tsx` | active, inactive | Marketplace, Wiki | color transition |
| `ChallengeCard` | `components/ChallengeCard.tsx` | — | Dashboard | progress bar animation |
| `TrailHealthCard` | `components/TrailHealthCard.tsx` | — | Dashboard | — |
| `RewardCard` | `components/RewardCard.tsx` | — | Marketplace | hover: lift + shadow |
| `TrashTypeCard` | `components/TrashTypeCard.tsx` | — | Wiki | hover: lift |
| `LeaderboardRow` | `components/LeaderboardRow.tsx` | podium, standard | Leaderboard | stagger fade-in |
| `RouteCard` | `components/RouteCard.tsx` | — | Route Select | hover: lift |
| `ActivityRow` | `components/ActivityRow.tsx` | nft, voucher | Profile | — |
| `CerroHero` | `components/CerroHero.tsx` | — | Dashboard | parallax on scroll |
| `ShimmerSkeleton` | `components/ui/ShimmerSkeleton.tsx` | text, card, stat, avatar | All loading states | shimmer CSS animation |
| `Toast` | `components/ui/Toast.tsx` | success, error, info | Mint, Redeem, GPS errors | slide-in + fade-out |

---

## 3. Animaciones aprobadas (Tier S)

| Animación | Trigger | Duración | Easing | Implementación | Páginas |
|---|---|---|---|---|---|
| Counter-up stats | mount + data change | 600ms | ease-out | CSS `@keyframes` + useEffect | Dashboard, Profile, Tracking, Leaderboard |
| Page transitions | route change | 200ms | ease-out | `framer-motion` `AnimatePresence` | All (in layout.tsx) |
| Hover/tap feedback | hover/active | 100ms | ease | `.haptic-active` CSS class | All clickable elements |
| Shimmer skeletons | loading state | infinite 1.5s | linear | CSS `@keyframes shimmer` | All pages |
| Toast notifications | event trigger | 300ms in, 200ms out | ease-out / ease-in | `framer-motion` `motion.div` | Mint, Redeem, Error |
| Confetti celebration | mint success | 2000ms | — | `canvas-confetti` | Hike (post-mint) |
| Map marker pulse | mount (tracking) | infinite 2s | ease-in-out | CSS `@keyframes pulse` | Tracking, Dashboard |
| Sidebar stagger | mount | 50ms stagger × 6 | ease-out | `framer-motion` `staggerChildren` | Desktop sidebar |
| Progress bar fill | mount + data | 800ms | ease-out | CSS `transition-transform` | ChallengeCard |
| Parallax hero | scroll | continuous | linear | CSS `transform: translateY(calc(...))` | Dashboard hero |
| GPS glow pulse | GPS locked | infinite 2s | ease-in-out | CSS `.gps-glow` + pulse | Tracking |
| Card lift on hover | hover | 150ms | ease-out | CSS `hover:-translate-y-1 hover:shadow-xl` | Rewards, Wiki, Routes |

---

## 4. Plan de migración por página

### 4.1 Dashboard (`/`) — mobile #1 + web #10

**Estrategia:** Split — `<MobileDashboard />` + `<DesktopDashboard />` via `md:hidden` / `hidden md:block`

**Reason:** Layout diff ~60%. Mobile has full-screen map BG + floating cards. Web has sidebar + 2-column grid.

**Hero background — CONFIRMED MAP (Leaflet):**
Both screenshots show interactive map tiles (visible road labels "Centinela", terrain features, "Montenegro"). This is a Leaflet map, NOT a static photo.
- **R1 applies:** All cards floating over the map MUST use `.solid-card` (opaque), NOT `.glass-card`
- The Stitch screenshots show glass-like cards, but on real Leaflet with mobile GPU, `backdrop-filter: blur(20px)` will cause jank
- **Mitigation:** Use `bg-white/95` (near-opaque) with `shadow-premium` for the floating cards. Visually close to glass, but GPU-safe. Reserve `.glass-card` only for the sidebar (web) and balance pill (no map behind them).
- R4 does NOT apply here (no hero photo to optimize)

**Hooks:** `usePrimaBalance`, `useHikerStats`, `useUserNFTs`

**Componentes nuevos:**
- `CerroHero` — Leaflet map background (reuse existing `HikeMap` component with static center, no tracking)
- `ChallengeCard` (daily challenge with progress bar)
- `TrailHealthCard` (litter index, erosion risk)
- `StatCard` (current alt, trail status)
- `CerroBalancePill` (mounted in layout.tsx, not here)

**Animaciones:** counter-up stats, progress bar challenge, stagger sidebar (NO parallax — map is interactive, not a photo)

**Riesgos:** R1 (glass over Leaflet — mitigated with solid cards), R3 (6 tabs < 380px)

**Estimación:** XL

---

### 4.2 Hike Tracking (`/hike`) — mobile #6 + web #9

**Estrategia:** Split — diff ~70%. Mobile is full-screen aerial photo BG with glass cards. Web is split-panel (map left, controls right).

**Hooks:** `useHikeTracker`, `useGPSValidation`, `HikeMap`, `SubmitHike`

**Componentes nuevos:**
- Glass stat cards (duration, km, units collected)
- GPS indicator with `.gps-glow`
- Camera/Location/Share action buttons
- End Mission / Cancel floating CTAs

**Animaciones:** GPS glow, counter-up duration/km, confetti on mint, pulse map markers

**Riesgos:** R1 (glass over Leaflet), R6 (camera/share APIs not implemented)

**AppShell:** `hideNav` mode — no bottom nav, no sidebar

**Estimación:** XL

---

### 4.3 Marketplace (`/rewards`) — mobile #5 + web #14

**Estrategia:** Single component with responsive classes — diff ~30%. Same card grid, just more columns on web.

**Hooks:** `useRewardsList`, `useRedeemReward`, `useApprovePrima`, `usePrimaBalance`

**Componentes nuevos:**
- `RewardCard` (image, title, price badge, redeem button)
- `CategoryPill` (filter pills)
- Confirm/Voucher modals (already exist, restyle)

**Animaciones:** card lift hover, counter-up balance, toast on redeem

**Riesgos:** R5 (image optimization)

**Estimación:** L

---

### 4.4 Profile (`/profile`) — mobile #3 + web #13

**Estrategia:** Single component — diff ~35%. Same sections, web wider.

**Hooks:** `usePrimaBalance`, `useHikerStats`, `useUserNFTs`, `useUserRedemptions`, Privy `usePrivy`

**Componentes nuevos:**
- `ActivityRow` (NFT minted, voucher redeemed)
- Profile header with avatar + wallet address
- Balance card with copy address

**Animaciones:** counter-up balance/stats, stagger activity list

**Riesgos:** R7 (wallet address display)

**Estimación:** L

---

### 4.5 Leaderboard (`/profile/leaderboard`) — mobile #4 + web #11

**Estrategia:** Single component — diff ~25%. Podium + list. Web adds more columns.

**Hooks:** `useHikerStats` (multi-user — currently mock data)

**Componentes nuevos:**
- Podium component (top 3 with medals)
- `LeaderboardRow`
- Data source: `data/leaderboard.ts` (mock with TODO)

**Animaciones:** stagger rows, counter-up stats, podium entrance

**Riesgos:** R8 (no real multi-user leaderboard hook)

**Estimación:** M

---

### 4.6 Wiki (`/wiki`) — mobile #2 + web #12

**Estrategia:** Single component — diff ~25%. Grid cols change (2→4), search stays same.

**Hooks:** None (static `data/trashTypes.ts`)

**Componentes nuevos:**
- `TrashTypeCard`
- Recycling guide steps (reuse existing)
- Search with `.inner-recess` input style

**Animaciones:** card lift hover, stagger grid on search filter

**Riesgos:** None significant

**Estimación:** M

---

### 4.7 Route Select (`/hike/select`) — mobile #7 + web #8

**Estrategia:** Single component — diff ~30%. Same card list, web adds map sidebar.

**Hooks:** None (static `data/cerros.ts`)

**Componentes nuevos:**
- `RouteCard` (trail image, difficulty badge, distance, elevation)
- Search bar with Material Symbols
- Sticky "Start Expedition" CTA

**Animaciones:** card lift hover, haptic-active CTA

**Riesgos:** R5 (trail images)

**Estimación:** M

---

## 5. Riesgos globales

| ID | Severidad | Dónde | Síntoma | Mitigación | Decisión |
|---|---|---|---|---|---|
| R1 | CRÍTICO | Dashboard, Tracking | `backdrop-filter: blur(20px)` sobre Leaflet tiles causa jank en mobile gama media (<30fps) | Usar `.solid-card` sobre mapa, `.glass-card` solo sobre áreas estáticas. En tracking: glass solo en stats panel, no sobre el mapa directamente. | Ya decidido: glass strategy aprobada |
| R2 | ALTO | Todas las rutas | Material Symbols via CDN (Google Fonts) falla si WiFi del evento es malo → íconos no cargan | Self-host: descargar `material-symbols-outlined.woff2`, servir desde `/public/fonts/`, `@font-face` en globals.css | Ya decidido: self-host obligatorio |
| R3 | ALTO | Bottom Nav (mobile) | 6 tabs en 375px = ~62px por tab. Con íconos 24px + label 10px es apretado pero viable. En 320px (iPhone SE1) se trunca. | Labels cortos (MAP, CLEAN, WIKI, SHOP, RANK, ME) = max 5 chars. Icon 20px. Test en 320px. | Ya decidido: labels EN confirmados |
| R4 | MEDIO | Dashboard, Routes | Stitch uses placeholder images (unsplash). Necesitamos `next/image` con `sizes` prop para LCP < 2.5s | `<CerroHero>` component con `next/image priority`, `sizes="100vw"`, webp fallback. Placeholder blur. | Ya decidido: next/image obligatorio |
| R5 | MEDIO | Marketplace, Routes | Reward images from IPFS (pinata) are large and unoptimized. Pinata 403s on some. | Use `next/image` with `unoptimized` for IPFS URLs. Add `onError` fallback to emoji. Already implemented in current code. | No decision needed |
| R6 | BAJO | Tracking | Stitch shows camera, location, share buttons. Camera/share Web APIs not implemented in hooks. | Render buttons but with `onClick={() => {}}` + TODO comment. GPS is already working via `useGPSValidation`. | No action needed for hackathon |
| R7 | BAJO | Profile | Wallet address truncation. Stitch shows `0x...4F2`. Current code does this already. | Keep current `shortAddr` logic. No change. | No decision needed |
| R8 | MEDIO | Leaderboard | No multi-user leaderboard hook exists. Stitch shows ranked list with avatars, names, scores. | Create `data/leaderboard.ts` with mock data array + TODO for on-chain hook. Current `useHikerStats` only works for connected user. | Already decided: mock OK with TODO |
| R9 | MEDIO | Page transitions | `framer-motion` adds ~50KB gzip to bundle. Must stay under 250KB total first load. | Verify with `next build` + `@next/bundle-analyzer`. If over budget, use CSS-only `@view-transition` instead. | Check after install |
| R10 | BAJO | Counter animations | wagmi hooks cause re-renders on every block (~1s on Monad). Counter-up may re-trigger. | Memoize formatted values. Only animate on significant change (> 1% diff). Use `useRef` for previous value comparison. | No decision needed |
| R11 | ALTO | CerroBalancePill during page transitions | Flickering / stale balance value when navigating between pages with framer-motion `AnimatePresence`. The pill unmounts and remounts with each page transition, causing a flash of `0` or previous value before the hook refetches. | a) Mount `CerroBalancePill` at `app/layout.tsx` level, OUTSIDE of `AnimatePresence` wrapper — it persists across all route changes. b) Wrap in `React.memo` to prevent re-renders from layout changes. c) Use `useDeferredValue(balance)` to smooth updates during concurrent renders. d) Add `key="cerro-pill"` to prevent React unmount. | Approved — implement when creating the component |

---

## 6. Librerías a instalar

| Library | Size (gzip) | Purpose | Justification |
|---|---|---|---|
| `framer-motion` | ~50KB | Page transitions, stagger, hover states | Approved. Quality > bundle for hackathon demo. |
| `canvas-confetti` | ~6KB | Celebration on NFT mint | Approved. Tiny, high impact moment. |

**Total bundle impact:** ~56KB gzip. Current first load ~180KB estimated. Total ~236KB < 250KB budget.

**NOT installing:**
- No animation library for counters (pure CSS/useEffect)
- No toast library (custom component with framer-motion)
- No skeleton library (custom CSS shimmer)

---

## 7. Performance budget checklist

| Metric | Budget | Strategy |
|---|---|---|
| LCP < 2.5s mobile 3G | Hero image with `priority` + `next/image`. Glass cards lazy. |
| CLS < 0.1 | Fixed dimensions on all images. Skeleton loaders match final size. |
| Bundle JS < 250KB gzip | framer-motion (~50KB) + canvas-confetti (~6KB) = headroom ~14KB |
| Lighthouse Perf > 85 | Measure after each page migration. Cut animations if needed. |
| Lighthouse A11y > 90 | aria-labels on nav, focus-visible on all interactive, contrast AA |

---

## 8. Orden recomendado de migración

| Order | Page | Route | Estimación | Reason |
|---|---|---|---|---|
| 1 | **AppShell + Nav** | — | L | Foundation. Sidebar (6 tabs), BottomNav (6 tabs), CerroBalancePill, glass utilities. Everything depends on this. |
| 2 | **Dashboard** | `/` | XL | First impression for judges. Hero, challenge card, stats, quick actions. |
| 3 | **Tracking** | `/hike` | XL | Core product. Full-screen map, glass stats, GPS, mint flow. |
| 4 | **Marketplace** | `/rewards` | L | Sells the token economy. Reward cards, redeem flow, category filters. |
| 5 | **Profile** | `/profile` | L | Closes the loop. Balance, activity, vouchers. |
| 6 | **Leaderboard** | `/profile/leaderboard` | M | Social proof. Podium + ranked list. |
| 7 | **Wiki** | `/wiki` | M | Educational. Grid cards, search, recycling guide. |
| 8 | **Route Select** | `/hike/select` | M | Trail picker. Cards with images, search, sticky CTA. |

**Total estimated effort:** 1 AppShell (L) + 2 XL + 2 L + 3 M = ~8 migration units

**Critical path:** AppShell → Dashboard → Tracking → Marketplace (these 4 = 80% of demo impact)

---

## 9. Diff summary: Current vs Stitch Premium

| Aspect | Current | Stitch Premium |
|---|---|---|
| Sidebar width | 240px (`w-60`) | 288px (`w-72`) + glass bg |
| Sidebar bg | `#FDFCF8` solid | `rgba(255,255,255,0.3) + blur(40px)` |
| Nav tabs | 5 (Home, Hike, Wiki, Rewards, Profile) | 6 (Map, Clean, Wiki, Shop, Rank, Me) |
| Bottom nav height | `h-20` (80px) | Same estimated |
| Main bg | `#fcf9f8` solid | `#fafaf4` + map/photo backgrounds |
| Card style | `bg-white/80 backdrop-blur-sm` | `.glass-card` / `.solid-card` split |
| Typography | Fraunces (display) + Lexend (body) + Space Grotesk (labels) | Lexend only |
| Brand orange | `#FF6B00` | `#FF6B00` (normalized from `#ff5c00` variants) |
| Stat values | `font-fraunces font-black text-4xl` | `font-lexend font-semibold text-headline-lg` |
| Hover states | `hover:shadow-lg hover:scale-[1.01]` | `.haptic-active:active scale(0.95)` + lift |
| Tracking page | AppShell visible | Full-screen, no nav |
| Balance display | In sidebar wallet pill | Fixed top-right `CerroBalancePill` on all routes |
| Skeleton loading | None | Shimmer skeletons required |
| Page transitions | None | framer-motion fade+slide |

---

## 10. Navigation specs (from Stitch HTML extraction)

### Mobile Bottom Nav (floating)
```
Position: fixed bottom-6 left-1/2 -translate-x-1/2
Size: w-[92%] max-w-md
Background: bg-stone-50/70 backdrop-blur-2xl
Border: rounded-[1.5rem] border border-white/20 shadow-2xl
Inner: flex justify-around items-center p-2

Active tab:   bg-white/40 rounded-2xl text-orange-600, icon FILL:1
Inactive tab: text-emerald-900/40 hover:text-orange-500

Tab labels: font-semibold uppercase tracking-widest text-[11px]
```

### Desktop Sidebar
```
Position: fixed left-0 top-0 h-screen hidden md:flex flex-col
Width: w-72 (288px)
Background: bg-white/30 backdrop-blur-2xl
Border: border-r border-white/10 shadow-2xl shadow-black/5
Z-index: z-40
Padding: p-6

Brand: w-10 h-10 rounded-lg bg-primary + text-xl font-black tracking-tighter
Nav items: flex items-center gap-sm px-4 py-3 rounded-xl
  Active:   bg-white/50 text-orange-600 shadow-inner-sm, icon FILL:1
  Inactive: text-green-900/70 hover:text-green-900 hover:translate-x-1
  Labels:   font-semibold uppercase tracking-widest text-[11px]

CTA button: mt-auto w-full py-3 bg-orange-600 text-white rounded-xl
```

### Nav tab mapping (icons)
| Tab | Mobile label | Desktop label | Icon (outline) | Route |
|---|---|---|---|---|
| 1 | MAP | MAP DASHBOARD | `map` | `/` |
| 2 | CLEAN | CLEAN | `potted_plant` | `/hike/select` |
| 3 | WIKI | ECO-WIKI | `menu_book` | `/wiki` |
| 4 | SHOP | MARKETPLACE | `storefront` | `/rewards` |
| 5 | RANK | LEADERBOARD | `leaderboard` | `/profile/leaderboard` |
| 6 | ME | MY IMPACT | `auto_graph` | `/profile` |

### Leaderboard podium colors
| Rank | Border | Badge bg |
|---|---|---|
| 1st (Gold) | `border-yellow-400` | `#fbbf24` |
| 2nd (Silver) | `border-stone-300` | `#d1d5db` |
| 3rd (Bronze) | `border-orange-300` | `#fb923c` |

---

## 11. Typography decision

Merged into section 1.2 above. See the unified typography table with final font assignments (Fraunces/Lexend/Space Grotesk) and rationale.
