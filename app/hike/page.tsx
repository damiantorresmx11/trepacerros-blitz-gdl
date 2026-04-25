"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HikeMap } from "@/components/HikeMap";
import { SubmitHike } from "@/components/SubmitHike";
import { useHikeTracker } from "@/hooks/useHikeTracker";
import { useGPSValidation } from "@/hooks/useGPSValidation";
import { ConnectButton } from "@/components/ConnectButton";

function formatDuration(totalSeconds: number): string {
  const safe = Number.isFinite(totalSeconds) && totalSeconds > 0 ? totalSeconds : 0;
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

interface StatCellProps {
  label: string;
  value: string;
  unit?: string;
}

function StatCell({ label, value, unit }: StatCellProps) {
  return (
    <Card className="p-4 flex flex-col items-center justify-center text-center bg-background/80">
      <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
      <span className="font-display text-2xl text-primary leading-tight">
        {value}
        {unit ? <span className="text-sm text-muted ml-1">{unit}</span> : null}
      </span>
    </Card>
  );
}

export default function HikePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const tracker = useHikeTracker();
  const { isTracking, points, stats, error, start, stop, reset } = tracker;

  const validation = useGPSValidation({
    distanceMeters: stats.distanceMeters,
    durationSeconds: stats.durationSeconds,
  });

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const hasPoints = points.length > 0;
  const hikeFinished = !isTracking && hasPoints;

  const mapPoints = points.map((p) => ({ lat: p.lat, lng: p.lng }));

  const handleMintClick = () => {
    if (!validation.valid) return;
    setShowSubmitModal(true);
  };

  const handleMinted = (_txHash: `0x${string}`) => {
    void _txHash;
    setShowSubmitModal(false);
    reset();
    router.push("/gallery");
  };

  const handleCancelModal = () => {
    setShowSubmitModal(false);
  };

  const handleDiscard = () => {
    if (confirm("¿Descartar este hike? Se perderán los datos.")) {
      reset();
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground font-sans px-4 py-6 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl text-primary">Mi hike</h1>
          <Link
            href="/"
            className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline"
          >
            Volver
          </Link>
        </header>

        {!isConnected || !address ? (
          <Card className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-display text-xl text-primary">Conecta tu wallet</h2>
            <p className="text-sm text-muted">
              Para iniciar un hike y mintear tu rastro necesitas estar
              conectado.
            </p>
            <ConnectButton />
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <StatCell
                label="Distancia"
                value={(stats.distanceMeters / 1000).toFixed(2)}
                unit="km"
              />
              <StatCell
                label="Tiempo"
                value={formatDuration(stats.durationSeconds)}
              />
              <StatCell
                label="Velocidad"
                value={stats.averageSpeedKmh.toFixed(1)}
                unit="km/h"
              />
              <StatCell
                label="Desnivel"
                value={Math.round(stats.elevationGain).toString()}
                unit="m"
              />
            </div>

            <HikeMap
              points={mapPoints}
              height={320}
              className="w-full shadow-md shadow-black/5"
            />

            {error ? (
              <Card className="bg-warm/10 text-warm">
                <p className="text-sm">{error}</p>
              </Card>
            ) : null}

            {hikeFinished ? (
              <div className="flex justify-center">
                {validation.valid ? (
                  <Badge variant="success" className="text-sm py-1 px-3">
                    Hike válido — listo para mintear
                  </Badge>
                ) : (
                  <Badge variant="warning" className="text-sm py-1 px-3">
                    {validation.reason ?? "Hike inválido"}
                  </Badge>
                )}
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              {!isTracking && !hasPoints ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={start}
                  className="w-full"
                >
                  Iniciar hike
                </Button>
              ) : null}

              {isTracking ? (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={stop}
                  className="w-full"
                >
                  Pausar / Detener
                </Button>
              ) : null}

              {hikeFinished ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleMintClick}
                    disabled={!validation.valid}
                    className="w-full"
                  >
                    Mintear NFT
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={handleDiscard}
                    className="w-full"
                  >
                    Descartar
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {showSubmitModal ? (
        <div
          className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl m-0 sm:m-4 bg-background rounded-none sm:rounded-2xl shadow-xl min-h-screen sm:min-h-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-muted/30 sticky top-0 bg-background z-10">
              <h2 className="font-display text-xl text-primary">
                Finalizar hike
              </h2>
              <button
                onClick={handleCancelModal}
                className="text-sm text-muted hover:text-foreground"
                aria-label="Cerrar"
              >
                Cerrar
              </button>
            </div>
            <div className="p-4">
              <SubmitHike
                stats={stats}
                points={mapPoints}
                onMinted={handleMinted}
                onCancel={handleCancelModal}
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
