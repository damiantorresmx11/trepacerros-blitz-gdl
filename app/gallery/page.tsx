"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/AppShell";
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
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 text-center">
        <span className="block font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">
          NFTs
        </span>
        <span className="block font-lexend text-tc-headline-md text-tc-primary">
          {totalNFTs}
        </span>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 text-center">
        <span className="block font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">
          kg limpios
        </span>
        <span className="block font-lexend text-tc-headline-md text-tc-primary">
          {kgValue}
        </span>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 text-center">
        <span className="block font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">
          Hikes
        </span>
        <span className="block font-lexend text-tc-headline-md text-tc-primary">
          {hikeValue}
        </span>
      </div>
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
    metadata?.name ?? `Trepada #${nft.tokenId.toString()}`;
  const trailName = getTrailName(nft.rastro.trailType);
  const imageUrl =
    metadata?.image && !imgFailed ? ipfsToGateway(metadata.image) : null;

  return (
    <button
      type="button"
      onClick={() => onSelect(nft, metadata)}
      className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcf9f8] rounded-2xl"
    >
      <Card className="p-0 overflow-hidden h-full hover:shadow-lg transition-shadow flex flex-col">
        <div className="aspect-square w-full bg-stone-100 relative">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
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
          <h3 className="font-lexend text-lg text-tc-primary leading-tight line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-stone-500">{trailName}</p>
          <div className="mt-auto pt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-tc-on-surface/80">
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
  const title = metadata?.name ?? `Trepada #${nft.tokenId.toString()}`;
  const imageUrl = metadata?.image ? ipfsToGateway(metadata.image) : null;
  const attrs = metadata?.attributes ?? [];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] md:max-w-lg bg-[#fcf9f8] rounded-t-3xl md:rounded-3xl shadow-xl min-h-0 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 sticky top-0 bg-[#fcf9f8] z-10">
          <h2 className="font-lexend text-tc-headline-md font-semibold text-tc-primary line-clamp-1">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-tc-on-surface p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] rounded-lg"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
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
              <span className="font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">Cerro</span>
              <span className="text-sm text-tc-on-surface">
                {getTrailName(nft.rastro.trailType)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">Fecha</span>
              <span className="text-sm text-tc-on-surface">
                {formatDate(nft.rastro.timestamp)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">Distancia</span>
              <span className="text-sm text-tc-on-surface">
                {formatKm(nft.rastro.distanceMeters)} km
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">Basura</span>
              <span className="text-sm text-tc-on-surface">
                {formatKg(nft.rastro.trashGrams)} kg
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">Duración</span>
              <span className="text-sm text-tc-on-surface">
                {Math.floor(Number(nft.rastro.durationSeconds) / 60)} min
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">
                Checkpoint oficial
              </span>
              <span className="text-sm text-tc-on-surface">
                {nft.rastro.officialCheckpoint ? "Sí" : "No"}
              </span>
            </div>
          </div>

          {metadata?.description ? (
            <p className="text-sm text-tc-on-surface-variant">{metadata.description}</p>
          ) : null}

          {attrs.length > 0 ? (
            <div>
              <h3 className="font-lexend text-base text-tc-primary mb-2">
                Atributos
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {attrs.map((attr, idx) => (
                  <div
                    key={`${attr.trait_type ?? "attr"}-${idx}`}
                    className="rounded-xl bg-stone-100 p-2"
                  >
                    <div className="font-space-grotesk text-[10px] uppercase text-stone-500 tracking-wider">
                      {attr.trait_type ?? "—"}
                    </div>
                    <div className="text-sm text-tc-on-surface">{String(attr.value ?? "")}</div>
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
          <div className="aspect-square w-full bg-stone-100 animate-pulse" />
          <div className="p-4 flex flex-col gap-2">
            <div className="h-4 bg-stone-200 rounded animate-pulse w-2/3" />
            <div className="h-3 bg-stone-100 rounded animate-pulse w-1/2" />
            <div className="h-3 bg-stone-100 rounded animate-pulse w-3/4" />
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
    <AppShell>
      <div className="font-lexend flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-tc-headline-lg font-semibold text-tc-primary">Mi galería</h1>
        </div>

        {!isConnected || !address ? (
          <Card className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-lexend text-tc-headline-md text-tc-primary">
              Conecta tu wallet
            </h2>
            <p className="text-sm text-tc-on-surface-variant">
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
              <div className="bg-[#ffdad6] text-[#93000a] rounded-xl p-4 text-sm">
                Error al cargar tus NFTs: {error.message}
              </div>
            ) : null}

            {isLoading ? (
              <SkeletonGrid />
            ) : nfts.length === 0 ? (
              <Card className="text-center py-12 flex flex-col items-center gap-3">
                <p className="font-lexend text-tc-headline-md text-tc-primary">
                  Aún no tienes hikes
                </p>
                <p className="text-sm text-tc-on-surface-variant">empezá uno</p>
                <Link
                  href="/hike"
                  className="mt-2 inline-flex items-center justify-center font-lexend font-bold rounded-2xl bg-[#FF6B00] text-white hover:bg-[#e66000] h-12 px-6 text-tc-cta uppercase tracking-widest active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fcf9f8]"
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
    </AppShell>
  );
}
