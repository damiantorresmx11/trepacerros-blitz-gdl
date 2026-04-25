# Checklist Blitz GDL 2026 — Rastros

## ANTES DEL EVENTO (hoy mismo)

### Equipo coordina
- [ ] Todos en el mismo canal de WhatsApp/Discord
- [ ] Confirman nombre final: **Rastros**
- [ ] Confirman concepto: GPS tracking + foto basura + NFT único + canje en 8 categorías
- [ ] Rol claro de cada uno (Damian code, artista 2D identidad, biomateriales contenido)

### Tú (Damian) — prep técnica
- [ ] Foundry instalado: `forge --version`
- [ ] Wallet nueva creada con MetaMask/Rabby SOLO para el hackathon
- [ ] MON de testnet solicitado en https://faucet.monad.xyz
- [ ] Cuenta Pinata creada (pinata.cloud) — JWT copiado
- [ ] Cuenta Privy creada (dashboard.privy.io) — APP_ID copiado
- [ ] Claude Code listo y funcionando
- [ ] Repo vacío en GitHub: `rastros` o como quieran nombrarlo
- [ ] Computadora cargada + cargador + mouse en la mochila

### Artista 2D — prep visual
- [ ] Paleta de colores confirmada (verde encino + tierra + crema)
- [ ] Fuente seleccionada (Fraunces + Inter / Unbounded + DM Sans)
- [ ] Mood board en Figma/Pinterest
- [ ] Empezar logo concept (aunque sea 3 variaciones simples)

### Biomateriales — prep contenido
- [ ] Revisar el archivo `frontend/data/trashTypes.ts`
- [ ] Completar/corregir datos de cada tipo de basura:
  - Tiempo de degradación exacto
  - Impacto con datos duros
  - Ruta de disposición correcta en GDL específicamente
- [ ] Sumar 5-10 tipos más si aplica (ej: llantas, textiles, electrónicos)

---

## VIERNES 24 ABRIL

### 2:00pm – 3:00pm → BIENVENIDA + MONAD 101
- [ ] Registro en Luma
- [ ] Presentarse al staff de Frutero Club
- [ ] Anotar contactos de mentores + comunidad de Monad
- [ ] **NO codear aún** — escuchar el workshop, tomar notas de lo relevante
- [ ] Preguntar después del workshop: ¿puede el staff hacer de "sponsor demo" para el showcase? (importante)

### 3:00pm – 4:00pm → SETUP + ALINEACIÓN
- [ ] Clonar `https://github.com/fruteroclub/monad-blitz-starter` → carpeta `rastros`
- [ ] Instalar deps: `pnpm install`
- [ ] Leer el README del starter completo
- [ ] Verificar que corre local: `pnpm dev`
- [ ] Crear `.env.local` con todas las vars
- [ ] Equipo alineado en tareas de la siguiente hora

### 4:00pm – 5:00pm → CONTRATOS
- [ ] Instalar OpenZeppelin: `forge install OpenZeppelin/openzeppelin-contracts --no-commit`
- [ ] Copiar los 3 .sol del folder `/contracts` al proyecto
- [ ] Compilar: `forge build` — sin errores
- [ ] **Tests rápidos** con `forge test` si hay tiempo (opcional)

### 5:00pm – 6:00pm → DEPLOY A MONAD TESTNET
- [ ] Correr deploy script:
  ```
  forge script script/Deploy.s.sol --rpc-url https://testnet-rpc.monad.xyz --broadcast --private-key $PRIVATE_KEY
  ```
- [ ] **GUARDAR las 3 direcciones** de contratos en `src/constants.ts`
- [ ] Verificar en el explorer: https://testnet.monadexplorer.com
- [ ] Todos los rewards deben aparecer en el registry (40+)

### 6:00pm – 7:00pm → FRONTEND: HOOK GPS + MAPA
- [ ] Copiar `useHikeTracker.ts` al proyecto
- [ ] Instalar: `pnpm add react-leaflet leaflet @types/leaflet`
- [ ] Crear componente `HikeMap.tsx` con dynamic import (SSR off)
- [ ] Página `/hike` con botón Iniciar + stats en vivo + mapa
- [ ] **PROBAR EN EL CELULAR** del venue — caminar 2 min para validar que GPS graba

### 7:00pm – 8:00pm → CENA + SUBMIT HIKE
- [ ] Comer algo (no se salten esto, son ~12 horas)
- [ ] Copiar `SubmitHike.tsx` al proyecto
- [ ] Copiar `trashTypes.ts` a `src/data/`
- [ ] Conectar submit con Pinata (subir foto a IPFS)
- [ ] Conectar mint con contrato RastroNFT (desde Privy wallet)

### 8:00pm – 9:00pm → PRIMER END-TO-END + CIERRE DÍA 1
- [ ] Hacer el flow completo de prueba con datos mock
- [ ] Un hike de prueba minteado en Monad testnet
- [ ] NFT visible en el explorer
- [ ] Tokens PRIMA acreditados en la wallet
- [ ] Commit y push al repo
- [ ] Lista de bugs/pendientes para mañana
- [ ] Dormir. En serio, dormir. Mañana es el día clave.

---

## SÁBADO 25 ABRIL

### 9:00am – 10:00am → CATÁLOGO DE RECOMPENSAS
- [ ] Llegar temprano, café primero
- [ ] Copiar `rewards.ts` y `RewardsCatalog.tsx` al proyecto
- [ ] Página `/rewards` conectada a `RewardRegistry.redeemReward()`
- [ ] Probar canje de 1 recompensa (la más barata, 10-15 PRIMA)
- [ ] Voucher se genera correctamente on-chain

### 10:00am – 11:00am → GALERÍA + LANDING
- [ ] Página `/gallery` con los NFTs del usuario
- [ ] Fetch de metadata de IPFS + render de la imagen
- [ ] Landing page (`/`) con hero + stats + CTAs
- [ ] Tagline: "Tus huellas, tu impacto."

### 11:00am – 12:00pm → HIKE DEMO REAL + DISEÑO
- [ ] **2 personas del equipo salen al parque más cercano** (10 min ida + 20 min hike + 10 min vuelta)
- [ ] Hacen un hike real de verdad, toman foto de basura real
- [ ] Suben al sistema, mintean NFT con datos reales
- [ ] Mientras, los demás pulen el diseño con el artista 2D
- [ ] **Gra­bar video backup** de la demo funcionando

### 12:00pm – 1:00pm → PITCH + PUSH FINAL
- [ ] Deck del pitch listo (máximo 6 slides)
- [ ] Ensayar el pitch 5 veces con timer (máx 3 min)
- [ ] README.md del repo completo
- [ ] **Push final** al repo público con el hash que pegan en la submission

### 1:00pm – 2:00pm → SUBMISSIONS + SHOWCASE
- [ ] Entregar en el form de submissions
- [ ] Cargar móvil al 100%
- [ ] Tener listo el video de backup (YouTube unlisted)
- [ ] Respirar hondo
- [ ] **Showcase** — pitch en vivo con demo

---

## PITCH — Estructura final (3 minutos)

```
[0:00 – 0:15] HOOK
"En Jalisco, en 2025, se quemaron 88 mil hectáreas. 919 incendios.
La Primavera, nuestro pulmón, es el más afectado.
Y cada fin de semana, miles suben al cerro sin razón para bajar
con algo más que fotos."

[0:15 – 1:00] DEMO EN VIVO (o video backup si WiFi falla)
- Iniciar hike → GPS activo
- Detener → foto de basura, tipo, kg
- NFT minteado con ruta + stats
- Tokens PRIMA acreditados
- Catálogo → canjear por algo

[1:00 – 1:30] CÓMO FUNCIONA
"Cada hike es un NFT único en Monad. Tu ruta, tu basura,
tu huella — tuya, para siempre. Y ganas puntos canjeables
en 40+ recompensas en 8 categorías: chela, café, eventos,
equipo outdoor, hasta donaciones directas a ONGs locales."

[1:30 – 2:00] CÓMO USA MONAD (checklist obligatorio del Builder Pack)
"Monad nos permite procesar cientos de hikes simultáneos con
gas de centavos. En un fin de semana en La Primavera con
500 hikers activos, son 5,000+ transacciones entre mints,
canjes y validaciones. Parallel EVM es la única forma
que esto sea económicamente viable."

[2:00 – 2:30] VALIDACIÓN Y APRENDIZAJES
"Hoy hicimos un hike real de prueba. La foto que ven en
este NFT es basura real recogida hoy por el equipo.
Aprendimos que el onboarding Web3 sigue siendo el talón
de Aquiles — lo resolvimos con Privy: zero seed phrase,
email y listo. La palabra 'blockchain' nunca aparece."

[2:30 – 3:00] PRÓXIMOS PASOS (checklist obligatorio)
"Siguiente paso: piloto con Bosque La Primavera A.C. y 2
cervecerías locales. Expansión a Tapalpa, Mazamitla,
Nevado de Colima. El bosque va a tardar en volver.
Nosotros ya estamos reconstruyéndolo, un kilómetro, un kilo
y una chela a la vez."

[cierre] GRACIAS
```

---

## RECORDATORIOS CRÍTICOS

🚨 **Código solo del día del evento** — borra cualquier rama previa en GitHub, empieza limpio el viernes 24.

🚨 **Al menos 1 contrato deployado en Monad testnet** — si no, descalificados. Haz deploy temprano.

🚨 **Repo público con README** — revisa que no esté privado antes del submission.

🚨 **Demo funcional en el showcase** — video backup preparado por si falla WiFi.

🚨 **Pitch estructurado**: Problema → Solución → Cómo usa Monad → Validación → Próximos pasos.

---

## PLAN DE CONTINGENCIA

Si algo falla en orden de prioridad:

1. **Si el mint on-chain falla en la demo:** muestra el video backup, no intentes debuggear en vivo.
2. **Si el GPS no funciona en el venue:** usa datos mock precargados (deja un botón oculto "demo mode" con una ruta de ejemplo).
3. **Si el deploy truena:** chequea que tengas MON del faucet. Si el RPC falla, espera 2 min y retry.
4. **Si Pinata da error:** sube la foto como base64 en la metadata (truco de emergencia, no ideal pero funciona).
5. **Si Privy falla:** fallback a wallet connect con MetaMask directo.

---

## DESPUÉS DEL PITCH

- [ ] Compartir el repo con Frutero Club en Discord
- [ ] Conectar con otros builders para futuros hackathons
- [ ] Tomar foto del equipo con el staff
- [ ] Subir demo a Twitter tagueando @fruteroclub @monad
- [ ] Agradecer a mentores por DM
