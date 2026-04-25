"use client";

import { useMemo } from "react";
import type { LatLng } from "@/lib/haversine";

export interface HikeValidationInput {
  distanceMeters: number;
  durationSeconds: number;
  points?: LatLng[];
}

export interface HikeValidationResult {
  valid: boolean;
  reason?: string;
}

const MIN_DISTANCE_METERS = 1000;
const MIN_DURATION_SECONDS = 1800;
const MAX_AVG_SPEED_MPS = 10;

/**
 * Valida un hike en progreso (o terminado) según reglas anti-trampa básicas:
 * - Distancia mínima: 1 km
 * - Duración mínima: 30 min
 * - Velocidad media razonable (<= 10 m/s ~ 36 km/h)
 *
 * Función pura — utilizable fuera de componentes React.
 */
export function validateHike(input: HikeValidationInput): HikeValidationResult {
  const { distanceMeters, durationSeconds } = input;

  if (distanceMeters < MIN_DISTANCE_METERS) {
    return { valid: false, reason: "Recorrido < 1 km" };
  }

  if (durationSeconds < MIN_DURATION_SECONDS) {
    return { valid: false, reason: "Duración < 30 min" };
  }

  const avgSpeed = durationSeconds > 0 ? distanceMeters / durationSeconds : 0;
  if (avgSpeed > MAX_AVG_SPEED_MPS) {
    return { valid: false, reason: "Velocidad sospechosa (¿en vehículo?)" };
  }

  return { valid: true };
}

/**
 * Hook delgado sobre `validateHike` con memoización.
 */
export function useGPSValidation(input: HikeValidationInput): HikeValidationResult {
  return useMemo(
    () => validateHike(input),
    [input.distanceMeters, input.durationSeconds, input.points],
  );
}
