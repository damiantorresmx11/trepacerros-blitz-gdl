# Trepacerros — Claude Design Redesign Plan

## DMLABS — Monad Blitz GDL 2026
**Time to deadline: ~3 hours**
**Branch:** `feat/claude-design-redesign`

---

## 1. What we got

### Bundle contents (from mobile pack — contains BOTH mobile + web)
```
claude-design/mobile/trepacerros/
├── README.md                    (handoff instructions)
├── chats/chat1.md               (full design conversation)
├── project/
│   ├── Trepacerros.html         (91KB — mobile, 6 screens + landing, INTERACTIVE JS)
│   ├── Trepacerros Web.html     (83KB — desktop landing page)
│   ├── tweaks-panel.jsx         (18KB — design tweaks UI)
│   └── uploads/                 (6 WhatsApp photos of current app, ~70KB each)
```

Web pack URL returned "not found" — but the mobile pack already includes `Trepacerros Web.html`.

### Design system (NEW — completely different from Stitch)

| Aspect | Stitch Premium (current) | Claude Design (new) |
|---|---|---|
| **Fonts** | Lexend only (we added Fraunces/Space Grotesk) | Big Shoulders Display + Geist + JetBrains Mono |
| **Colors** | M3 hex palette (#154212, #2d5a27, etc) | oklch() palette (--ink, --moss, --ember, --sky) |
| **Aesthetic** | Material 3 glass morphism | Outdoor topographic + web3 (contour lines, stamps, coordinates) |
| **Icons** | Material Symbols Outlined | Material Symbols Outlined (same) |
| **Dark mode** | Not implemented | Built-in via CSS custom properties |
| **Nav (mobile)** | 6 floating glass tabs | 5 bottom tabs (Landing/Home/Hike/Wiki/Rewards/Profile via JS router) |
| **Sidebar (web)** | Glass w-72 with 6 items | Web is landing-only, no sidebar |
| **Interactivity** | Static HTML | ~210 lines JS: routing, wallet connect sim, hike tracking sim, +1 counter, toasts |
| **CSS** | Tailwind CDN + custom classes | Pure CSS custom properties + vanilla CSS (NO Tailwind) |

### Pages covered

| Page | Mobile | Web |
|---|---|---|
| Landing (unauthenticated) | ✅ Full poster + hero + CTA | ✅ Full desktop landing |
| Home (authenticated dashboard) | ✅ Stats, XP bar, challenges, trails nearby | ❌ Web is landing-only |
| Hike (3 states: idle/active/ended) | ✅ All 3 states with transitions | ❌ |
| Wiki | ✅ Search, categories, material grid | ❌ |
| Rewards/Marketplace | ✅ Balance, filters, product grid | ❌ |
| Profile | ✅ Avatar, balance, badges, ledger | ❌ |
| Leaderboard | ❌ (embedded in Profile) | ❌ |
| Route Select | ❌ (embedded in Hike idle) | ❌ |

### Key design features
- **Topographic contour lines** as subtle background pattern
- **Coordinate chips** (20.6736°N 103.3500°W) for web3 feel
- **Passport stamps** (hexagonal badges) for achievements
- **Elevation profile** SVG in hike idle state
- **Pickup counter** (+1 button that animates $CERRO earning in real-time)
- **Dawn gradient** hero (sunrise over cerros)
- **XP/Level system** (Trepador → Caminante → etc)
- **Real local brands** in marketplace (Minerva, Café Capilla, Cineteca, Tortas Toño)

---

## 2. Compatibility assessment

### What works
- ✅ Same icon system (Material Symbols Outlined, already self-hosted)
- ✅ Same product concept and page structure
- ✅ Same data model (hooks, contracts, tokens)
- ✅ Mobile-first approach matches our AppShell
- ✅ Dark mode is a bonus feature
- ✅ JS interactivity shows HOW routing/state should work (good reference)

### What breaks
- ❌ **NO Tailwind** — pure CSS. Every class needs rewriting for our Tailwind setup
- ❌ **oklch() colors** — not compatible with our hex-based tailwind.config. Need conversion.
- ❌ **3 NEW fonts** — Big Shoulders Display, Geist, JetBrains Mono. Need installing via next/font/google. Replaces our Fraunces/Lexend/Space Grotesk stack entirely.
- ❌ **Web is landing-only** — no authenticated desktop app views. We'd need to create desktop versions ourselves for Dashboard, Hike, Wiki, Rewards, Profile.
- ❌ **No Sidebar** — web doesn't have one. We'd need to keep our Unit 1 sidebar or build a new one.
- ❌ **5 tabs not 6** — different nav structure from what we committed in Unit 1.
- ❌ **90KB+ of monolithic HTML** — extraction is manual, line-by-line JSX conversion.

### Risk: oklch() browser support
oklch() works in Chrome 111+, Safari 15.4+, Firefox 113+. Should be fine for hackathon judges, but NOT for older browsers. Fallback hex values recommended.

---

## 3. Decision

### PATH B — HÍBRIDO

**Reasoning:**
1. The mobile design is **dramatically better** than Stitch — it has real personality, topographic aesthetic, actual interactivity, and GDL-specific content.
2. BUT the web version is landing-only — no authenticated app views. We can't drop our sidebar/AppShell for desktop.
3. AND it's pure CSS (no Tailwind) — converting 90KB of CSS to Tailwind would take 3+ hours alone.
4. The **pragmatic move**: extract the VISUAL DESIGN (colors, typography, patterns, component aesthetics) and apply it to our existing Tailwind/Next.js structure. Don't convert the HTML line-by-line.

**Hybrid strategy:**
- **Keep:** AppShell, Sidebar, BottomNav structure from Unit 1
- **Adopt:** Color palette (convert oklch→hex), typography (Big Shoulders Display + Geist + JetBrains Mono), topographic aesthetic, card patterns
- **Extract:** Key visual components (landing hero, hike states, pickup counter, passport stamps)
- **Migrate:** Page content using Claude Design as visual reference, NOT code copy

### NOT Path A because:
- Web is landing-only (no dashboard/profile/wiki/rewards in desktop)
- No Tailwind means full CSS rewrite
- Monolithic HTML (not componentized)

### NOT Path C because:
- The design is genuinely premium and distinctive
- The aesthetic (topographic + web3) is more memorable than Stitch's Material 3 glass

---

## 4. Migration plan (PATH B)

### Phase 1 — Design system swap (30 min)
1. Convert oklch palette to hex, add to tailwind.config
2. Install Big Shoulders Display + Geist + JetBrains Mono via next/font/google
3. Update globals.css with topographic patterns (contour lines SVG)
4. Update nav labels/icons to match Claude Design's 5-tab or keep 6-tab

### Phase 2 — Page migration by priority (60 min, 4 parallel agents)

| Priority | Page | Strategy | Agent |
|---|---|---|---|
| 1 | Landing (`/` unauthenticated) | Extract from Claude Design mobile. Poster headline, hero, CTA. | Agent 4 |
| 2 | Dashboard (`/` authenticated) | Adapt Claude Design Home screen. Stats, XP, challenges. | Agent 5 |
| 3 | Hike (`/hike`) | Extract 3 states from Claude Design. Map + HUD + pickup counter. | Agent 6 |
| 4 | Marketplace (`/rewards`) | Adapt Claude Design Rewards. Balance, filters, product grid. | Agent 7 |
| 5 | Profile + Leaderboard | Quick adaptation — lower priority. | Post-agents |
| 6 | Wiki + Route Select | Minimal changes — apply new colors/fonts only. | Post-agents |

### Phase 3 — QA + deploy (10 min)
- tsc clean, build pass, 9 routes 200
- Visual spot-check on 375px and 1440px

---

## 5. Risks

| ID | Severity | Issue | Mitigation |
|---|---|---|---|
| R1 | ALTO | 3 new Google Fonts = 3 additional network requests on first load | Use next/font/google with display: swap. Subset to latin. |
| R2 | MEDIO | oklch() to hex conversion loses some color nuance | Convert with online tool, verify visually |
| R3 | MEDIO | Big Shoulders Display may not have all needed weights | Verify 400-800 range available |
| R4 | BAJO | Topographic SVG pattern may increase page weight | Inline as CSS background, small footprint |
| R5 | ALTO | 60 min for 4 pages is aggressive | Focus on Landing + Dashboard + Hike (80% of demo impact) |

---

## 6. Estimated timeline

| Phase | Time | Cumulative |
|---|---|---|
| Design system swap | 30 min | 0:30 |
| Landing page | 15 min | 0:45 |
| Dashboard | 20 min | 1:05 |
| Hike (3 states) | 25 min | 1:30 |
| Marketplace | 15 min | 1:45 |
| Profile + Wiki (minimal) | 15 min | 2:00 |
| QA + build + deploy | 10 min | 2:10 |
| **Buffer** | 50 min | **3:00** |

Fits within 3-hour deadline with 50 min buffer.

---

## 7. Fonts to install

```
pnpm add @fontsource/big-shoulders-display @fontsource/geist-sans @fontsource/jetbrains-mono
```
OR use next/font/google (preferred — automatic optimization):
```tsx
import { Big_Shoulders_Display, Geist, JetBrains_Mono } from 'next/font/google'
```

---

## 8. Color conversion (oklch → hex approximations)

| Token | oklch | Hex approx | Usage |
|---|---|---|---|
| `--bg` | `oklch(0.975 0.012 90)` | `#f7f5ef` | Background (warm paper) |
| `--ink` | `oklch(0.22 0.045 150)` | `#1a2e1f` | Primary text (forest green) |
| `--moss` | `oklch(0.42 0.09 150)` | `#2d5a3e` | Secondary text/accents |
| `--ember` | `oklch(0.68 0.18 50)` | `#d4742a` | CTA, $CERRO brand |
| `--sky` | `oklch(0.85 0.04 220)` | `#c0d5e8` | Info, maps, subtle |
| `--leaf` | `oklch(0.55 0.09 150)` | `#3d7a52` | Success, positive |
| `--paper` | `oklch(0.99 0.008 90)` | `#fdfcf7` | Card backgrounds |
| `--muted` | `oklch(0.45 0.02 150)` | `#5c6b5f` | Muted text |
| `--bg (dark)` | `oklch(0.18 0.02 150)` | `#1a2820` | Dark mode bg |
| `--ink (dark)` | `oklch(0.96 0.012 90)` | `#f5f3ed` | Dark mode text |
