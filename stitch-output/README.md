# Stitch UI — Ola 3 (integración pendiente)

Documenta lo que viene de Stitch para que la próxima sesión de Claude Code pueda arrancar la integración sin perder contexto.

## Origen

- **Project ID:** `8988882067203283510`
- **Título:** "Remix of Trepacerros Gamified Trail Cleaning"
- **Stitch MCP:** server `stitch.googleapis.com/mcp` ya conectado en `claude mcp list`. En la sesión actual no expuso tools — al reiniciar Claude Code deberían estar disponibles.

## Branding

El proyecto en Stitch ya usa el nombre **Trepacerros**. La app local sigue como **Rastros** (commit `08abae1` y anteriores). El **rename Rastros → Trepacerros se hace AL FINAL**, junto con la integración de Stitch — no antes.

## Las 9 pantallas

Cada una se baja a `/stitch-output/<screen-id>/` con su propio `README.md`, los assets de imagen, y el código generado por Stitch (HTML/React/Tailwind — formato a confirmar en el reporte de descarga).

| # | Screen ID | Nombre Stitch | Mapeo a la app actual | Estado |
|---|---|---|---|---|
| 1 | `a49b0fae85dc4abe9c409548634f0b0b` | Dashboard | `/dashboard` (NUEVO) o reemplaza `/` para usuarios autenticados | pendiente download |
| 2 | `9c299ff6c061488db901ff3141896b40` | Selección de Ruta | Pre-paso de `/hike` o subruta `/hike/select` (NUEVO) | pendiente download |
| 3 | `1e3d06e1ec0c4e54a797db0db44d1466` | Seguimiento de Trepada Activa | Reemplaza estado activo de `/hike/page.tsx` | pendiente download |
| 4 | `3049897b2efd45b8999d941b976ee515` | Proof of Clean | Reemplaza modal `<SubmitHike>` | pendiente download |
| 5 | `aef4f9f1948849d79c181a7b7be90346` | Completed Route Dashboard | Reemplaza estado `success` de SubmitHike, o página nueva `/hike/[id]` | pendiente download |
| 6 | `f0518ea27afb4450af877ff00ab137bc` | Marketplace | Reemplaza `/rewards/page.tsx` | pendiente download |
| 7 | `2a5be75480564f1a8ab9dd8933b6bad6` | Leaderboard | `/leaderboard` (NUEVO) — usa `hikerTotalKg` y `hikerHikeCount` on-chain | pendiente download |
| 8 | `a3096b8fb4204db4aa8593493d0378f9` | Perfil y Billetera | Reemplaza `/profile/page.tsx` | pendiente download |
| 9 | `376a6e8e00c74806bb0d7c5b58981bce` | Wiki de Residuos | `/wiki` (NUEVO) — alimentada por `/data/trashTypes.ts` + `/data/educativo.ts` | pendiente download |

> **Decisión pendiente:** "Dashboard" (`a49b0f...`) ¿reemplaza la landing (`/`) cuando el user está autenticado, o vive en `/dashboard` aparte y dejamos la landing solo para visitantes anónimos? A definir antes de integrar.

## Lo que ya existe en el repo (no se toca durante la integración)

- **Contratos en Monad testnet** (chain id `10143`):
  - PrimaToken     `0xd4Bf2c611f382Cd51ff484276CE6c008016de881`
  - RastroNFT      `0x6b4D0F9024479219af325D6Cca5aBa3AFec76952`
  - RewardRegistry `0x4327566658bA16a37d804e8738AD283170a53b27`
  - 41 rewards seedeados
- **Hooks on-chain** (en `/hooks/`): `useRastros.ts` (mintHike, primaBalance, userNFTs, hikerStats), `useRewards.ts` (rewardsList, redeem, userRedemptions, approve)
- **Lib** (en `/lib/`): `contracts.ts`, `abis.ts`, `pinata.ts`, `ipfs.ts`, `haversine.ts`, `generateNFTImage.ts`, `wagmi.ts`
- **Componentes funcionales**: `HikeMap` (Leaflet ssr-safe), `SubmitHike` (pipeline de 5 stages), `Providers` (Privy + wagmi), primitives en `/components/ui/`
- **Páginas que ya consumen on-chain**: `/hike`, `/gallery`, `/rewards`, `/profile`, `/blitz-demo`, `/`

## Plan de integración (Ola 3)

La regla rectora es **preservar la lógica on-chain ya validada y reemplazar SOLO la capa visual**. Los hooks no se reescriben; las páginas se reescriben para consumir los mismos hooks con el markup nuevo de Stitch.

Pasos sugeridos:

1. **Descarga (Fase A)** — Bajar las 9 pantallas a `/stitch-output/<id>/` con su README. Reportar:
   - Stack que usa Stitch (HTML+CSS / React+Tailwind / otra)
   - Si los componentes son monolíticos por pantalla o reutilizables
   - Imports externos (lucide-react, fonts, etc.)
   - Compatibilidad con Next.js 14 App Router (server vs client components)
   - Consistencia visual entre las 9 pantallas
2. **Reconciliación de design tokens (Fase B)** — Comparar paleta de Stitch contra la actual de Rastros (`primary: #2A5C3E` etc.). Decidir: adoptar Stitch tal cual, mergear, o mantener Rastros y adaptar Stitch al theme local.
3. **Migración por pantalla (Fase C, paralelizable)** — Para cada pantalla: extraer el JSX/CSS, crear el componente en `/components/stitch/<screen>/`, conectar a los hooks existentes, reemplazar la página correspondiente. Probar tras cada una.
4. **Rename Rastros → Trepacerros (Fase D, AL FINAL)** — find+replace coordinado en strings de UI, metadata, `package.json`, `app/layout.tsx`, READMEs. **No tocar nombres de contratos/símbolos** (PrimaToken/RASTRO/PRIMA siguen igual on-chain).
5. **QA + commit final**.

## Estado del repo al cierre de la sesión actual

- Branch: `main`
- Último commit: `08abae1` — `feat(ola2): Rastros e2e flow ...`
- Penúltimo commit: `cb34069` — `feat(ola1): Rastros foundations ...`
- Working tree: limpio salvo este README en `/stitch-output/`
- Dev server: apagado (puerto 3000 libre)
- Wallet deployer: ~6.23 MON disponibles para tx adicionales si Ola 3 necesita re-deploy (no debería)

## Para la próxima sesión — prompt de arranque

```
Continuá Ola 3 — integración Stitch UI. Project ID 8988882067203283510 ("Remix of Trepacerros Gamified Trail Cleaning").

Fase A: descargá las 9 pantallas a /stitch-output/<screen-id>/ con README cada una. IDs y mapeo en /stitch-output/README.md.

Reportá antes de integrar:
- Stack de Stitch (HTML/Tailwind/React/CSS modules)
- Componentes monolíticos vs separados
- Consistencia entre pantallas
- Compat con Next.js 14 App Router
- Dependencias externas (lucide-react, fonts)
- Cualquier observación crítica

NO arranques integración hasta mi go. NO renombres Rastros→Trepacerros todavía.
```
