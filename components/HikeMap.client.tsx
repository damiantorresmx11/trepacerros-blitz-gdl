"use client";

import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default Leaflet marker icons break under bundlers (next/webpack).
// Patch them at module load using CDN-hosted assets.
// @ts-expect-error - leaflet's default icon path patch
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface LatLng {
  lat: number;
  lng: number;
}

export interface HikeMapClientProps {
  points: LatLng[];
  className?: string;
  /** Map height in px. Defaults to 320. */
  height?: number;
}

export default function HikeMapClient({
  points,
  className,
  height = 320,
}: HikeMapClientProps) {
  if (points.length === 0) {
    return (
      <div
        className={`flex items-center justify-center w-full rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 text-sm ${
          className ?? ""
        }`}
        style={{ height: `${height}px` }}
      >
        Esperando GPS...
      </div>
    );
  }

  const positions: [number, number][] = points.map((p) => [p.lat, p.lng]);
  const bounds = L.latLngBounds(positions);
  const start = positions[0];
  const end = positions[positions.length - 1];
  const showEndMarker = positions.length > 1;

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [24, 24] }}
      scrollWheelZoom={false}
      dragging
      touchZoom
      className={`rounded-2xl overflow-hidden ${className ?? ""}`}
      style={{ height: `${height}px`, width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline
        positions={positions}
        pathOptions={{ color: "#2A5C3E", weight: 4, opacity: 0.9 }}
      />
      <Marker position={start} />
      {showEndMarker && <Marker position={end} />}
    </MapContainer>
  );
}
