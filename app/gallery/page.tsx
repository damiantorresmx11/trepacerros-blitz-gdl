"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ConnectButton } from "@/components/ConnectButton";
import {
  useUserNFTs,
  useHikerStats,
  type UserNFT,
} from "@/hooks/useRastros";
import { fetchFromIPFS, ipfsToGateway } from "@/lib/ipfs";

const TRAIL_NAMES: Record<number, string> = {
  0: "La Primavera",
  1: "Colli",
  2: "Colomos",
  3: "Metropolitano",
  4: "Otro",
};

interface NFTAttribute {
  trait_type?: string;
  value?: string | number | boolean;
}

interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: NFTAttribute[];
}

function getTrailName(trailType: number): string {
  return TRAIL_NAMES[trailType] ?? "Otro";
}

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString("es-MX");
}

function formatKg(grams: bigint): string {
  const kg = Number(grams) / 1000;
  return kg.toFixed(2);
}

function formatKm(meters: bigint): string {
  const km = Number(meters) / 1000;
  return km.toFixed(2);
}

function StatStrip({
  totalNFTs,
  totalKg,
  hikes,
  isLoading,
}: {
  totalNFTs: number;
  totalKg: bigint;
  hikes: bigint;
  isLoading: boolean;
}) {
  const kgValue = isLoading ? "..." : (Number(totalKg) / 1000).toFixed(2);
  const hikeValue = isLoading ? "..." : hikes.toString();

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <Card className="p-3 sm:p-4 text-center bg-background/80">
        <span className="block text-xs uppercase tracking-wide text-muted">
          NFTs
        </span>
        <span className="block font-display text-2xl text-primary">
          {totalNFTs}
        </span>
      </Card>
      <Card className="p-3 sm:p-4 text-center bg-background/80">
        <span className="block text-xs uppercase tracking-wide text-muted">
          kg limpios
        </span>
        <span className="block font-display text-2xl text-primary">
          {kgValue}
        </span>
      </Card>
      <Card className="p-3 sm:p-4 text-center bg-background/80">
        <span className="block text-xs uppercase tracking-wide text-muted">
          Hikes
        </span>
        <span className="block font-display text-2xl text-primary">
          {hikeValue}
        </span>
      </Card>
    </div>
  );
}

interface NFTCardProps {
  nft: UserNFT;
  onSelect: (nft: UserNFT, metadata: NFTMetadata | null) => void;
}

function NFTCard({ nft, onSelect }: NFTCardProps) {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setMetaError(null);
    fetchFromIPFS<NFTMetadata>(nft.tokenURI)
      .then((data) => {
        if (!cancelled) setMetadata(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setMetaError(err instanceof Error ? err.message : "Error metadata");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [nft.tokenURI]);

  const title =
    metadata?.name ?? `Rastro #${nft.tokenId.toString()}`;
  const trailName = getTrailName(nft.rastro.trailType);
  const imageUrl =
    metadata?.image && !imgFailed ? ipfsToGateway(metadata.image) : null;

  return (
    <button
      type="button"
      onClick={() => onSelect(nft, metadata)}
      className="text-left focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl"
    >
      <Card className="p-0 overflow-hidden h-full hover:shadow-lg transition-shadow flex flex-col">
        <div className="aspect-square w-full bg-muted/20 relative">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">
              {metaError ? "Sin imagen" : "Cargando..."}
            </div>
          )}
          {nft.rastro.officialCheckpoint ? (
            <Badge
              variant="accent"
              className="absolute top-2 right-2"
            >
              Oficial
            </Badge>
          ) : null}
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="font-display text-lg text-primary leading-tight line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-muted">{trailName}</p>
          <div className="mt-auto pt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground/80">
            <span>{formatKm(nft.rastro.distanceMeters)} km</span>
            <span>{formatKg(nft.rastro.trashGrams)} kg</span>
            <span>{formatDate(nft.rastro.timestamp)}</span>
          </div>
        </div>
      </Card>
    </button>
  );
}

interface NFTDetailModalProps {
  nft: UserNFT;
  metadata: NFTMetadata | null;
  onClose: () => void;
}

function NFTDetailModal({ nft, metadata, onClose }: NFTDetailModalProps) {
  const title = metadata?.name ?? `Rastro #${nft.tokenId.toString()}`;
  const imageUrl = metadata?.image ? ipfsToGateway(metadata.image) : null;
  const attrs = metadata?.attributes ?? [];

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg m-0 sm:m-4 bg-background rounded-none sm:rounded-2xl shadow-xl min-h-screen sm:min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-muted/30 sticky top-0 bg-background z-10">
          <h2 className="font-display text-xl text-primary line-clamp-1">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-sm text-muted hover:text-foreground ml-4 shrink-0"
            aria-label="Cerrar"
          >
            Cerrar
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className="w-full rounded-2xl object-cover"
            />
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className="text-xs uppercase text-muted">Cerro</span>
              <span className="text-sm">
                {getTrailName(nft.rastro.trailType)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase text-muted">Fecha</span>
              <span className="text-sm">
                {formatDate(nft.rastro.timestamp)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase text-muted">Distancia</span>
              <span className="text-sm">
                {formatKm(nft.rastro.distanceMeters)} km
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase text-muted">Basura</span>
              <span className="text-sm">
                {formatKg(nft.rastro.trashGrams)} kg
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase text-muted">Duración</span>
              <span className="text-sm">
                {Math.floor(Number(nft.rastro.durationSeconds) / 60)} min
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase text-muted">
                Checkpoint oficial
              </span>
              <span className="text-sm">
                {nft.rastro.officialCheckpoint ? "Sí" : "No"}
              </span>
            </div>
          </div>

          {metadata?.description ? (
            <p className="text-sm text-foreground/80">{metadata.description}</p>
          ) : null}

          {attrs.length > 0 ? (
            <div>
              <h3 className="font-display text-base text-primary mb-2">
                Atributos
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {attrs.map((attr, idx) => (
                  <div
                    key={`${attr.trait_type ?? "attr"}-${idx}`}
                    className="rounded-xl bg-muted/15 p-2"
                  >
                    <div className="text-xs uppercase text-muted">
                      {attr.trait_type ?? "—"}
                    </div>
                    <div className="text-sm">{String(attr.value ?? "")}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-0 overflow-hidden">
          <div className="aspect-square w-full bg-muted/20 animate-pulse" />
          <div className="p-4 flex flex-col gap-2">
            <div className="h-4 bg-muted/30 rounded animate-pulse w-2/3" />
            <div className="h-3 bg-muted/20 rounded animate-pulse w-1/2" />
            <div className="h-3 bg-muted/20 rounded animate-pulse w-3/4" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const { address, isConnected } = useAccount();
  const { nfts, isLoading, error } = useUserNFTs(address);
  const stats = useHikerStats(address);

  const [selected, setSelected] = useState<{
    nft: UserNFT;
    metadata: NFTMetadata | null;
  } | null>(null);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans px-4 py-6 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl text-primary">Mi galería</h1>
          <Link
            href="/"
            className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline"
          >
            Volver
          </Link>
        </header>

        {!isConnected || !address ? (
          <Card className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-display text-xl text-primary">
              Conecta tu wallet
            </h2>
            <p className="text-sm text-muted">
              Para ver tus NFTs necesitas estar conectado.
            </p>
            <ConnectButton />
          </Card>
        ) : (
          <>
            <StatStrip
              totalNFTs={nfts.length}
              totalKg={stats.totalKg}
              hikes={stats.hikes}
              isLoading={stats.isLoading}
            />

            {error ? (
              <Card className="bg-warm/10 text-warm mb-4">
                <p className="text-sm">
                  Error al cargar tus NFTs: {error.message}
                </p>
              </Card>
            ) : null}

            {isLoading ? (
              <SkeletonGrid />
            ) : nfts.length === 0 ? (
              <Card className="text-center py-12 flex flex-col items-center gap-3">
                <p className="font-display text-xl text-primary">
                  Aún no tienes hikes
                </p>
                <p className="text-sm text-muted">empezá uno</p>
                <Link
                  href="/hike"
                  className="mt-2 inline-flex items-center justify-center font-sans font-medium rounded-xl bg-primary text-background hover:bg-primary/90 h-10 px-4 text-base"
                >
                  Iniciar hike
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nfts.map((nft) => (
                  <NFTCard
                    key={nft.tokenId.toString()}
                    nft={nft}
                    onSelect={(n, m) => setSelected({ nft: n, metadata: m })}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selected ? (
        <NFTDetailModal
          nft={selected.nft}
          metadata={selected.metadata}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </main>
  );
}
