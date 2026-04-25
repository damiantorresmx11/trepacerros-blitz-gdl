import type { LatLng } from "@/lib/haversine";

export interface GenerateNFTImageInput {
  tokenIdLabel: string;
  trailName: string;
  distanceKm: number;
  durationMinutes: number;
  trashKg: number;
  primaEarned: number;
  date: Date;
  points: LatLng[];
  photoFile?: File | Blob;
}

const SIZE = 1080;
const FOREST = "#2A5C3E";
const CREAM = "#F5F1E8";
const WARM = "#FF6B35";
const TERRACOTTA = "#C24D2C";
const ACCENT_GREEN = "#3E8C5A";
const TEXT_DARK = "#1F3A29";
const TEXT_MUTED = "#6E7C72";

interface Projector {
  translate(p: LatLng): { x: number; y: number };
}

function fitBounds(
  points: LatLng[],
  originX: number,
  originY: number,
  targetW: number,
  targetH: number,
  padding = 40,
): Projector {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  }
  const lngSpan = Math.max(1e-9, maxLng - minLng);
  const latSpan = Math.max(1e-9, maxLat - minLat);
  const innerW = targetW - padding * 2;
  const innerH = targetH - padding * 2;
  const scale = Math.min(innerW / lngSpan, innerH / latSpan);
  const drawnW = lngSpan * scale;
  const drawnH = latSpan * scale;
  const offsetX = originX + padding + (innerW - drawnW) / 2;
  const offsetY = originY + padding + (innerH - drawnH) / 2;
  return {
    translate(p: LatLng) {
      const x = offsetX + (p.lng - minLng) * scale;
      // Flip Y so north is up.
      const y = offsetY + (maxLat - p.lat) * scale;
      return { x, y };
    },
  };
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawBackground(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = FOREST;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle radial vignette / soft inner glow for some depth.
  const grad = ctx.createRadialGradient(SIZE / 2, SIZE / 2, 200, SIZE / 2, SIZE / 2, SIZE * 0.75);
  grad.addColorStop(0, "rgba(255,255,255,0.04)");
  grad.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);
}

function drawHeader(ctx: CanvasRenderingContext2D, tokenIdLabel: string, trailName: string): void {
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, SIZE, 120);

  ctx.fillStyle = TEXT_DARK;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.font = 'bold 56px "Fraunces", Georgia, serif';
  ctx.fillText(tokenIdLabel, 48, 60);

  ctx.fillStyle = TEXT_MUTED;
  ctx.font = '500 22px "Inter", system-ui, sans-serif';
  ctx.textAlign = "right";
  ctx.fillText("RASTROS · MONAD", SIZE - 48, 60);

  // Trail name subtitle (lives just below header on the green).
  ctx.fillStyle = "rgba(245,241,232,0.85)";
  ctx.font = 'italic 28px "Fraunces", Georgia, serif';
  ctx.textAlign = "left";
  ctx.fillText(trailName, 48, 120 + 32);
}

function drawPolyline(ctx: CanvasRenderingContext2D, points: LatLng[]): void {
  const x = 240;
  const y = 200;
  const w = 600;
  const h = 600;

  // Subtle map "card" backdrop.
  ctx.save();
  ctx.fillStyle = "rgba(245,241,232,0.06)";
  roundedRect(ctx, x - 20, y - 20, w + 40, h + 40, 24);
  ctx.fill();
  ctx.restore();

  if (points.length < 2) {
    // Friendly placeholder.
    ctx.save();
    ctx.fillStyle = "rgba(245,241,232,0.10)";
    roundedRect(ctx, x, y, w, h, 16);
    ctx.fill();

    ctx.fillStyle = CREAM;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = 'bold 64px "Inter", system-ui, sans-serif';
    ctx.fillText("○", x + w / 2, y + h / 2 - 30);
    ctx.font = '500 32px "Inter", system-ui, sans-serif';
    ctx.fillText("Sin GPS", x + w / 2, y + h / 2 + 40);
    ctx.restore();
    return;
  }

  const projector = fitBounds(points, x, y, w, h, 60);

  // Glow underlay.
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(255,107,53,0.25)";
  ctx.lineWidth = 22;
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    const p = projector.translate(points[i]);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // Main polyline.
  ctx.strokeStyle = WARM;
  ctx.lineWidth = 8;
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    const p = projector.translate(points[i]);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  ctx.restore();

  // Start dot (green) and end dot (terracotta).
  const start = projector.translate(points[0]);
  const end = projector.translate(points[points.length - 1]);

  const drawDot = (cx: number, cy: number, color: string): void => {
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  drawDot(start.x, start.y, ACCENT_GREEN);
  drawDot(end.x, end.y, TERRACOTTA);
}

async function drawPolaroid(
  ctx: CanvasRenderingContext2D,
  photoFile: File | Blob,
): Promise<void> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(photoFile);
  } catch {
    return;
  }

  const size = 240;
  const cx = SIZE - 180;
  const cy = 280;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-4 * Math.PI) / 180);

  // White polaroid frame.
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = "#FFFFFF";
  roundedRect(ctx, -size / 2 - 16, -size / 2 - 16, size + 32, size + 60, 12);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Photo (cover-fit + clipped to rounded square).
  ctx.save();
  roundedRect(ctx, -size / 2, -size / 2, size, size, 8);
  ctx.clip();
  const bw = bitmap.width;
  const bh = bitmap.height;
  const scale = Math.max(size / bw, size / bh);
  const drawW = bw * scale;
  const drawH = bh * scale;
  ctx.drawImage(bitmap, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  ctx.restore();

  bitmap.close?.();
}

interface StatCell {
  label: string;
  value: string;
}

function drawStatsFooter(ctx: CanvasRenderingContext2D, cells: StatCell[]): void {
  const footerY = SIZE - 240;
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, footerY, SIZE, 240);

  // Decorative top border line.
  ctx.fillStyle = WARM;
  ctx.fillRect(0, footerY, SIZE, 4);

  const cols = 3;
  const rows = 2;
  const cellW = SIZE / cols;
  const cellH = 240 / rows;

  for (let i = 0; i < cells.length && i < cols * rows; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = col * cellW + cellW / 2;
    const cy = footerY + row * cellH + cellH / 2;

    ctx.textAlign = "center";

    // Label
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = '600 22px "Inter", system-ui, sans-serif';
    ctx.textBaseline = "middle";
    ctx.fillText(cells[i].label.toUpperCase(), cx, cy - 28);

    // Value
    ctx.fillStyle = TEXT_DARK;
    ctx.font = '700 44px "Fraunces", Georgia, serif';
    ctx.fillText(cells[i].value, cx, cy + 18);
  }

  // Vertical divider lines between columns.
  ctx.strokeStyle = "rgba(31,58,41,0.12)";
  ctx.lineWidth = 1;
  for (let c = 1; c < cols; c++) {
    const x = c * cellW;
    ctx.beginPath();
    ctx.moveTo(x, footerY + 24);
    ctx.lineTo(x, SIZE - 24);
    ctx.stroke();
  }
  // Horizontal divider between rows.
  ctx.beginPath();
  ctx.moveTo(48, footerY + cellH);
  ctx.lineTo(SIZE - 48, footerY + cellH);
  ctx.stroke();
}

function formatDistance(km: number): string {
  return `${km.toFixed(2)} km`;
}

function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h <= 0) return `${m} min`;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function formatTrash(kg: number): string {
  if (kg >= 10) return `${kg.toFixed(0)} kg`;
  return `${kg.toFixed(1)} kg`;
}

function formatPrima(amount: number): string {
  return `${Math.round(amount)} ✨`;
}

function formatDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export async function generateNFTImage(input: GenerateNFTImageInput): Promise<Blob> {
  if (typeof window === "undefined") {
    throw new Error("generateNFTImage must run in the browser");
  }

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context unavailable");

  drawBackground(ctx);
  drawHeader(ctx, input.tokenIdLabel, input.trailName);
  drawPolyline(ctx, input.points);

  if (input.photoFile) {
    try {
      await drawPolaroid(ctx, input.photoFile);
    } catch {
      // Non-fatal: polaroid is decorative only.
    }
  }

  const cells: StatCell[] = [
    { label: "Distancia", value: formatDistance(input.distanceKm) },
    { label: "Tiempo", value: formatDuration(input.durationMinutes) },
    { label: "Peso", value: formatTrash(input.trashKg) },
    { label: "PRIMA", value: formatPrima(input.primaEarned) },
    { label: "Cerro", value: input.trailName },
    { label: "Fecha", value: formatDate(input.date) },
  ];
  drawStatsFooter(ctx, cells);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("toBlob returned null"));
      },
      "image/png",
      0.92,
    );
  });
}
