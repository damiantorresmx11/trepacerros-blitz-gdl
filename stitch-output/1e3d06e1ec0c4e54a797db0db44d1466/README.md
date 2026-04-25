# Screen: Seguimiento de Trepada Activa
- **ID:** 1e3d06e1ec0c4e54a797db0db44d1466
- **Title:** Seguimiento de Trepada Activa
- **Stitch Size:** 390x884 (mobile, full-screen map)
- **Mapeo:** Reemplaza estado activo de `/hike/page.tsx`

## Contenido
- Full-screen satellite map con GPS path overlay (SVG, green stroke)
- "Live Mission" indicator (pulsing red dot)
- Side controls (layers, my_location)
- Glass card overlay con stats: Distance (2.4 KM), Duration (15:20), Trash (1.2 KG)
- CTA "END TREPADA" (Safety Orange)
- Floating badge "+45 ECO POINTS"
- Bottom nav: TREKS tab active (diferente label que otras pantallas)

## Stack
HTML + Tailwind CDN + Material Symbols + inline SVG path
