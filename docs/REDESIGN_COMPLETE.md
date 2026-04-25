# Trepacerros — Claude Design Redesign Complete

## DMLABS — Monad Blitz GDL 2026
**Branch:** `feat/claude-design-redesign`
**Commits:** `0e7ee58` (foundation) + `56175eb` (all pages)

---

## Pages migrated

| Page | Route | Status | Hooks wired | Notes |
|---|---|---|---|---|
| Landing | `/` (unauth) | ✅ | usePrivy.login | Poster headline, dawn gradient, 3-step onboarding |
| Dashboard | `/` (auth) | ✅ | usePrimaBalance, useHikerStats, useUserNFTs | Greeting, stats, daily challenges, recent trails |
| Hike | `/hike` | ✅ | useHikeTracker, useGPSValidation, HikeMap, SubmitHike | 3 states: idle/active/ended, hideNav mode |
| Marketplace | `/rewards` | ✅ | useRewardsList, useRedeemReward, useApprovePrima | Balance, filters, reward grid, confirm/voucher modals |
| Profile | `/profile` | ✅ | usePrimaBalance, useHikerStats, useUserNFTs, useUserRedemptions | Avatar, badges, on-chain ledger |
| Leaderboard | `/profile/leaderboard` | ✅ | useHikerStats (single user) | Podium + ranked list (mock data) |
| Wiki | `/wiki` | ✅ | data/trashTypes.ts | Category chips, multiplier badges, recycling guide |
| Route Select | `/hike/select` | ✅ | data/cerros.ts | Trail cards, search, sticky CTA |
| Gallery | `/gallery` | ⚠️ | useUserNFTs | Not redesigned (kept previous styling) |

## Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | ✅ Clean |
| `pnpm build` | ✅ Passes |
| 9/9 routes HTTP 200 | ✅ All pass |
| Shared JS | 89.2 KB |
| Pushed to origin | ✅ `feat/claude-design-redesign` |

## Design system changes

| Aspect | Before | After |
|---|---|---|
| Display font | Fraunces (serif) | Big Shoulders Display (signage) |
| Body font | Lexend | Lexend (kept) |
| Mono font | Space Grotesk | JetBrains Mono |
| Primary bg | `#fcf9f8` | `#f7f5ef` (warm paper) |
| Primary text | `#1b1b1c` | `#1a2e1f` (forest green) |
| Accent | `#FF6B00` | `#d4742a` (ember) |
| Secondary | `#2d5a27` | `#2d5a3e` (moss) |
| Card style | `bg-white/80 backdrop-blur` | `.solid-card` (opaque, 22px radius) |
| Patterns | None | Topographic contour lines SVG |
| Gradients | None | Dawn gradient (warm sunrise) |
| Data display | Mixed fonts | JetBrains Mono for all numbers |
| Coordinates | None | `.coordinate-chip` with lat/lon |

## Known bugs / issues

1. **Gallery page** (`/gallery`) not redesigned — still uses old tc-* tokens. Low priority (not in main nav).
2. **Daily challenges** on Dashboard are static placeholders — no hook for real challenge data.
3. **Leaderboard** uses mock data — no multi-user on-chain hook exists.
4. **Profile avatar** uses oklch gradient inline style — may render differently on older browsers.
5. **Route Select** trail images are placeholder gradient backgrounds, not real photos.
6. **`color-mix()` CSS function** used in profile page — Chrome 111+ only.
7. **Counter-up animations** not yet implemented (CSS keyframes exist but not wired to data changes).
8. **Confetti celebration** on mint success not yet wired (canvas-confetti installed but unused).
9. **Page transitions** with framer-motion AnimatePresence not yet wired in layout.

## What was NOT done (time constraints)

- [ ] Page transition animations (framer-motion AnimatePresence)
- [ ] Counter-up animations on stat values
- [ ] Confetti on successful NFT mint
- [ ] Toast notifications on mint/redeem
- [ ] Gallery page redesign
- [ ] Dark mode toggle
- [ ] Parallax/scroll animations
- [ ] Shimmer skeleton loading states (component exists, not wired)

## What to test first

1. **Landing page** — connect wallet flow (Privy login)
2. **Dashboard** — verify real $CERRO balance shows
3. **Hike** — start tracking, verify GPS, end + mint NFT
4. **Rewards** — browse catalog, try redeem flow
5. **Profile** — verify NFTs show, address copy works
