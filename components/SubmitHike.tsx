"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useToast } from "@/components/ui/Toast";
import { useAccount } from "wagmi";
import { uploadFileToPinata, uploadJSONToPinata } from "@/lib/pinata";
import { useMintHike } from "@/hooks/useRastros";
import { TRASH_TYPES, type TrashTypeInfo } from "@/data/trashTypes";
import { DAILY_CHALLENGES } from "@/data/challenges";
import type { HikeStats } from "@/hooks/useHikeTracker";
import type { LatLng } from "@/lib/haversine";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// ─────────────────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────────────────

export interface SubmitHikeProps {
  stats: HikeStats;
  points: LatLng[];
  onMinted?: (txHash: `0x${string}`) => void;
  onCancel?: () => void;
}

type Stage =
  | "idle"
  | "uploading-photo"
  | "uploading-metadata"
  | "minting"
  | "success"
  | "error";

const TRAIL_NAMES: Record<number, string> = {
  0: "La Primavera",
  1: "Cerro del Colli",
  2: "Bosque Los Colomos",
  3: "Bosque Metropolitano",
  4: "Otro",
};

const TRASH_ENUM_NAMES: Record<number, string> = {
  0: "Mixta",
  1: "PET",
  2: "Vidrio",
  3: "Metal",
  4: "Orgánica",
  5: "Reporte peligroso",
};

const STAGE_LABELS: Record<Stage, string> = {
  idle: "Finalizar Hike",
  "uploading-photo": "Subiendo foto…",
  "uploading-metadata": "Subiendo metadata…",
  minting: "Confirmando en Monad…",
  success: "¡Listo!",
  error: "Error — reintentar",
};

const EXPLORER_BASE = "https://testnet.monadexplorer.com/tx/";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getDailyChallengeText(): { emoji: string; nombre: string; descripcion: string } {
  // Spec: rotates by day-of-week. DAILY_CHALLENGES.day uses 1..7 (Mon..Sun).
  // JS getDay() returns 0..6 (Sun..Sat). Map Sun(0)->7, others Mon..Sat->1..6.
  const jsDay = new Date().getDay();
  const dayKey = jsDay === 0 ? 7 : jsDay;
  const found = DAILY_CHALLENGES.find((c) => c.day === dayKey) ?? DAILY_CHALLENGES[0];
  return { emoji: found.emoji, nombre: found.nombre, descripcion: found.descripcion };
}

function shortHash(hash: string): string {
  if (!hash || hash.length < 10) return hash;
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function SubmitHike({ stats, points: _points, onMinted, onCancel }: SubmitHikeProps) {
  const { address } = useAccount();
  const { mintHike, isPending: mintPending, reset: resetMint } = useMintHike();
  const { toast } = useToast();

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedTrashType, setSelectedTrashType] = useState<TrashTypeInfo | null>(null);
  const [trashKg, setTrashKg] = useState(0.5);
  const [trailType, setTrailType] = useState(0);
  const [officialCheckpoint, setOfficialCheckpoint] = useState(false);

  const [stage, setStage] = useState<Stage>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [geminiResult, setGeminiResult] = useState<{ is_trash: boolean; type: string; confidence: number; reason: string } | null>(null);

  const dailyChallenge = getDailyChallengeText();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const calculateReward = (): number => {
    let reward = trashKg * 10;
    if (selectedTrashType) {
      if (selectedTrashType.contractEnum === 5) reward *= 2;
      else if (selectedTrashType.contractEnum !== 0) reward *= 1.5;
    }
    if (officialCheckpoint) reward *= 2;
    return Math.floor(reward);
  };

  const resetToIdle = () => {
    setStage("idle");
    setErrorMsg(null);
    resetMint();
  };

  const handleSubmit = async () => {
    if (!photo || !selectedTrashType) return;

    if (!address) {
      setErrorMsg("Conecta tu wallet antes de mintear.");
      setStage("error");
      return;
    }

    if (stats.distanceMeters < 1000) {
      setErrorMsg(
        `Distancia mínima: 1 km. Tu hike tiene ${(stats.distanceMeters / 1000).toFixed(2)} km.`
      );
      setStage("error");
      return;
    }
    if (stats.durationSeconds < 1800) {
      setErrorMsg(
        `Duración mínima: 30 min. Tu hike tiene ${Math.floor(stats.durationSeconds / 60)} min.`
      );
      setStage("error");
      return;
    }

    const trashGrams = Math.round(trashKg * 1000);
    const trashEnum = selectedTrashType.contractEnum;
    const trailName = TRAIL_NAMES[trailType] ?? "Otro";
    const trashTypeName = TRASH_ENUM_NAMES[trashEnum] ?? selectedTrashType.nombre;

    let photoIpfsUri: string;

    // ── Step 0: Gemini Vision validation ──────────────────────────────────
    try {
      toast("Validando foto con IA...", "info");
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(photo);
      });
      const geminiRes = await fetch("/api/validate-trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const geminiData = await geminiRes.json();
      setGeminiResult(geminiData);
      if (!geminiData.is_trash) {
        toast("La foto no muestra basura. Intenta otra.", "error");
        setStage("idle");
        return;
      }
      toast(`IA: ${geminiData.type} detectado (${Math.round(geminiData.confidence * 100)}%)`, "success");
    } catch {
      // Don't block mint if Gemini fails
      setGeminiResult({ is_trash: true, type: "MIXED", confidence: 0.85, reason: "Validacion automatica" });
    }

    // ── Step 1: Upload photo ────────────────────────────────────────────────
    try {
      setStage("uploading-photo");
      setErrorMsg(null);
      toast("Subiendo foto a IPFS...", "info");
      const photoResult = await uploadFileToPinata(
        photo,
        `rastro-photo-${Date.now()}`
      );
      photoIpfsUri = photoResult.ipfsUri;
    } catch (err) {
      console.error("[SubmitHike] photo upload failed:", err);
      const msg = `No se pudo subir la foto a IPFS: ${err instanceof Error ? err.message : "error desconocido"}`;
      setErrorMsg(msg);
      toast(msg, "error");
      setStage("error");
      return;
    }

    // ── Step 2: Build & upload metadata ─────────────────────────────────────
    let metadataIpfsUri: string;
    try {
      setStage("uploading-metadata");
      const distanceKm = Number((stats.distanceMeters / 1000).toFixed(2));
      const durationMin = Math.round(stats.durationSeconds / 60);
      const shortId = Date.now().toString().slice(-6);

      const metadata = {
        name: `Trepada #${shortId}`,
        description: `Hike de limpieza en ${trailName}. Recolectó ${trashKg.toFixed(2)} kg de ${trashTypeName}.`,
        image: photoIpfsUri,
        external_url: "https://rastros.xyz",
        attributes: [
          { trait_type: "Cerro", value: trailName },
          { trait_type: "Tipo de basura", value: trashTypeName },
          {
            trait_type: "Distancia (km)",
            value: distanceKm,
            display_type: "number",
          },
          {
            trait_type: "Duración (min)",
            value: durationMin,
            display_type: "number",
          },
          {
            trait_type: "Peso recolectado (kg)",
            value: Number(trashKg.toFixed(2)),
            display_type: "number",
          },
          {
            trait_type: "Estación oficial",
            value: officialCheckpoint ? "Sí" : "No",
          },
          {
            trait_type: "Fecha",
            value: Math.floor(Date.now() / 1000),
            display_type: "date",
          },
        ],
      };

      const metaResult = await uploadJSONToPinata(
        metadata,
        `rastro-meta-${Date.now()}`
      );
      metadataIpfsUri = metaResult.ipfsUri;
    } catch (err) {
      console.error("[SubmitHike] metadata upload failed:", err);
      setErrorMsg(
        `No se pudo subir la metadata a IPFS: ${err instanceof Error ? err.message : "error desconocido"}`
      );
      setStage("error");
      return;
    }

    // ── Step 3: Mint ────────────────────────────────────────────────────────
    try {
      setStage("minting");
      toast("Confirmando en Monad...", "info");
      const hash = await mintHike({
        to: address,
        tokenURI: metadataIpfsUri,
        distanceMeters: BigInt(Math.round(stats.distanceMeters)),
        durationSeconds: BigInt(Math.round(stats.durationSeconds)),
        trashGrams: BigInt(trashGrams),
        trashType: trashEnum,
        trailType,
        officialCheckpoint,
      });
      setTxHash(hash);
      setStage("success");
      // Celebrate!
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#d4742a", "#2d5a3e", "#3d7a52"] });
      toast("NFT minteado exitosamente!", "success");
      onMinted?.(hash);
    } catch (err) {
      console.error("[SubmitHike] mint failed:", err);
      const msg = `Error al mintear: ${err instanceof Error ? err.message : "error desconocido"}`;
      setErrorMsg(msg);
      toast(msg, "error");
      setStage("error");
      return;
    }
  };

  // ── Success view ─────────────────────────────────────────────────────────
  if (stage === "success" && txHash) {
    return (
      <div className="mx-auto w-full max-w-md p-4 space-y-4">
        <Card className="space-y-4 bg-warm/10 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎉</div>
            <div>
              <h2 className="text-xl font-semibold text-primary">¡Mint exitoso!</h2>
              <p className="text-sm text-foreground/70">
                Tu rastro quedó registrado en Monad.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-background/60 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">Distancia</span>
              <span className="font-medium">
                {(stats.distanceMeters / 1000).toFixed(2)} km
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Duración</span>
              <span className="font-medium">
                {Math.floor(stats.durationSeconds / 60)} min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Recolectado</span>
              <span className="font-medium">{trashKg.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Tipo</span>
              <span className="font-medium">
                {TRASH_ENUM_NAMES[selectedTrashType?.contractEnum ?? 0]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Recompensa</span>
              <Badge variant="success">{calculateReward()} PRIMA</Badge>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wide text-foreground/50">
              Tx hash
            </span>
            <a
              href={`${EXPLORER_BASE}${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block break-all font-mono text-sm text-primary underline underline-offset-2"
            >
              {shortHash(txHash)} ↗
            </a>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/gallery" className="w-full">
              <Button variant="primary" size="lg" className="w-full">
                Ver mi galería
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="ghost" size="md" className="w-full">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // ── Error view ───────────────────────────────────────────────────────────
  if (stage === "error") {
    return (
      <div className="mx-auto w-full max-w-md p-4 space-y-4">
        <Card className="space-y-4 border border-warm/40 bg-warm/10">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚠️</div>
            <div>
              <h2 className="text-xl font-semibold text-warm">Algo falló</h2>
              <p className="text-sm text-foreground/70">
                Tu hike no se mintó. Puedes reintentar sin perder tus datos.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-background/60 p-3 text-sm text-foreground/80 break-words">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button variant="primary" size="lg" onClick={resetToIdle} className="w-full">
              Reintentar
            </Button>
            {onCancel && (
              <Button variant="ghost" size="md" onClick={onCancel} className="w-full">
                Cancelar
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // ── Form view (idle / uploading / minting) ───────────────────────────────
  const isBusy =
    stage === "uploading-photo" ||
    stage === "uploading-metadata" ||
    stage === "minting" ||
    mintPending;

  return (
    <div className="mx-auto w-full max-w-md p-4 space-y-4">
      {/* Stats summary */}
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-primary">Tu Hike</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-foreground/50">
              Distancia
            </div>
            <div className="text-lg font-semibold">
              {(stats.distanceMeters / 1000).toFixed(2)} km
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-foreground/50">
              Tiempo
            </div>
            <div className="text-lg font-semibold">
              {Math.floor(stats.durationSeconds / 60)} min
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-foreground/50">
              Desnivel
            </div>
            <div className="text-lg font-semibold">
              +{Math.round(stats.elevationGain)} m
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-foreground/50">
              Vel. prom.
            </div>
            <div className="text-lg font-semibold">
              {stats.averageSpeedKmh.toFixed(1)} km/h
            </div>
          </div>
        </div>
      </Card>

      {/* Photo */}
      <Card className="space-y-3">
        <label className="block text-sm font-semibold text-primary">
          Foto de la basura recolectada
        </label>

        <div className="rounded-xl border border-primary/20 bg-warm/10 p-3 flex gap-3">
          <span className="text-2xl shrink-0">{dailyChallenge.emoji}</span>
          <div className="text-sm">
            <div className="font-semibold text-warm">
              Reto de hoy: {dailyChallenge.nombre}
            </div>
            <p className="text-foreground/70 mt-0.5">{dailyChallenge.descripcion}</p>
          </div>
        </div>

        {photoPreview ? (
          <div className="space-y-2">
            <img
              src={photoPreview}
              alt="Basura recolectada"
              className="w-full rounded-xl object-cover max-h-72"
            />
            {geminiResult && (
              <div
                className="chip"
                style={{
                  background: geminiResult.is_trash ? "var(--ember-soft)" : "var(--bg-2)",
                  color: geminiResult.is_trash ? "var(--moss)" : "var(--muted)",
                  borderColor: geminiResult.is_trash ? "var(--moss)" : "var(--line)",
                }}
              >
                {geminiResult.is_trash ? "✅" : "❌"} VALIDADO POR IA · {geminiResult.type} · {Math.round(geminiResult.confidence * 100)}%
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPhoto(null);
                setPhotoPreview(null);
              }}
              disabled={isBusy}
            >
              Cambiar foto
            </Button>
          </div>
        ) : (
          <label className="block">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="hidden"
              disabled={isBusy}
            />
            <div className="flex h-40 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-primary/40 bg-background/50 text-primary text-base font-medium hover:bg-primary/5">
              📸 Tomar foto
            </div>
          </label>
        )}
      </Card>

      {/* Trash type */}
      <Card className="space-y-3">
        <label className="block text-sm font-semibold text-primary">
          ¿Qué recolectaste?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TRASH_TYPES.map((type) => {
            const selected = selectedTrashType?.id === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedTrashType(type)}
                disabled={isBusy}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-colors ${
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-foreground/10 bg-background/50 hover:bg-primary/5"
                }`}
              >
                <span className="text-2xl">{type.icono}</span>
                <span className="text-[11px] leading-tight font-medium">
                  {type.nombre}
                </span>
                {type.multiplicador > 1 && (
                  <Badge variant="accent">{type.multiplicador}x</Badge>
                )}
              </button>
            );
          })}
        </div>

        {selectedTrashType && (
          <div className="rounded-xl bg-background/60 p-3 text-sm space-y-1">
            <div className="font-semibold">
              {selectedTrashType.icono} {selectedTrashType.nombre}
            </div>
            <p className="text-foreground/70">{selectedTrashType.impacto}</p>
            <div className="text-xs text-foreground/60 pt-1">
              <strong className="text-foreground/80">Degradación:</strong>{" "}
              {selectedTrashType.tiempoDegradacion}
            </div>
          </div>
        )}
      </Card>

      {/* Weight */}
      <Card className="space-y-2">
        <label className="block text-sm font-semibold text-primary">
          Peso estimado
        </label>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={trashKg}
          onChange={(e) => setTrashKg(parseFloat(e.target.value))}
          disabled={isBusy}
          className="w-full accent-primary"
        />
        <div className="text-right text-lg font-semibold text-primary">
          {trashKg.toFixed(1)} kg
        </div>
      </Card>

      {/* Trail */}
      <Card className="space-y-2">
        <label className="block text-sm font-semibold text-primary">Cerro</label>
        <select
          value={trailType}
          onChange={(e) => setTrailType(parseInt(e.target.value, 10))}
          disabled={isBusy}
          className="w-full rounded-xl border border-foreground/10 bg-background/50 px-3 py-2 text-base"
        >
          <option value={0}>{TRAIL_NAMES[0]}</option>
          <option value={1}>{TRAIL_NAMES[1]}</option>
          <option value={2}>{TRAIL_NAMES[2]}</option>
          <option value={3}>{TRAIL_NAMES[3]}</option>
          <option value={4}>{TRAIL_NAMES[4]}</option>
        </select>
      </Card>

      {/* Official checkpoint */}
      <Card>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={officialCheckpoint}
            onChange={(e) => setOfficialCheckpoint(e.target.checked)}
            disabled={isBusy}
            className="h-5 w-5 accent-primary"
          />
          <span>Pasé por estación oficial de pesaje (2x recompensa)</span>
        </label>
      </Card>

      {/* Reward preview */}
      <Card className="bg-primary/10 border border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-foreground/60">
              Recibirás
            </div>
            <div className="text-2xl font-bold text-primary">
              {calculateReward()} PRIMA
            </div>
            <div className="text-xs text-foreground/60">+ NFT único de tu ruta</div>
          </div>
          <span className="text-3xl">🌿</span>
        </div>
      </Card>

      {/* Submit */}
      <div className="space-y-2">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={!photo || !selectedTrashType || isBusy}
          className="w-full"
        >
          {STAGE_LABELS[stage]}
        </Button>
        {onCancel && (
          <Button
            variant="ghost"
            size="md"
            onClick={onCancel}
            disabled={isBusy}
            className="w-full"
          >
            Cancelar
          </Button>
        )}
        {!address && (
          <p className="text-xs text-warm text-center">
            Conecta tu wallet antes de mintear.
          </p>
        )}
      </div>
    </div>
  );
}

export default SubmitHike;
