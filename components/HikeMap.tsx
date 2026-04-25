"use client";

import dynamic from "next/dynamic";
import type { HikeMapClientProps } from "./HikeMap.client";

const HikeMapClient = dynamic(() => import("./HikeMap.client"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] w-full rounded-2xl bg-muted/20 animate-pulse" />
  ),
});

export type { LatLng, HikeMapClientProps as HikeMapProps } from "./HikeMap.client";

export default function HikeMap(props: HikeMapClientProps) {
  return <HikeMapClient {...props} />;
}

export { HikeMap };
