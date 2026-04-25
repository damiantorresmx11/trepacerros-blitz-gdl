"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: number;
  elevation?: number | null;
  accuracy: number;
}

export interface HikeStats {
  distanceMeters: number;
  durationSeconds: number;
  elevationGain: number;
  averageSpeedKmh: number;
  maxSpeedKmh: number;
}

/**
 * Hook que maneja tracking GPS del hike.
 * - Guarda puntos localmente (funciona sin señal).
 * - Calcula stats en vivo (distancia con Haversine, velocidad, elevación).
 * - Persiste en localStorage para resistir cierre de app.
 */
export function useHikeTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [points, setPoints] = useState<GPSPoint[]>([]);
  const [stats, setStats] = useState<HikeStats>({
    distanceMeters: 0,
    durationSeconds: 0,
    elevationGain: 0,
    averageSpeedKmh: 0,
    maxSpeedKmh: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pointsRef = useRef<GPSPoint[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Formula Haversine para distancia entre dos puntos GPS (en metros)
  const haversine = (p1: GPSPoint, p2: GPSPoint): number => {
    const R = 6371000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(p2.lat - p1.lat);
    const dLng = toRad(p2.lng - p1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const recalcStats = useCallback((allPoints: GPSPoint[]) => {
    if (allPoints.length < 2 || !startTimeRef.current) return;

    let totalDist = 0;
    let elevGain = 0;
    let maxSpeed = 0;

    for (let i = 1; i < allPoints.length; i++) {
      const prev = allPoints[i - 1];
      const curr = allPoints[i];
      const segDist = haversine(prev, curr);
      totalDist += segDist;

      if (curr.elevation != null && prev.elevation != null && curr.elevation > prev.elevation) {
        elevGain += curr.elevation - prev.elevation;
      }

      const segTime = (curr.timestamp - prev.timestamp) / 1000;
      if (segTime > 0) {
        const segSpeedKmh = (segDist / segTime) * 3.6;
        if (segSpeedKmh > maxSpeed) maxSpeed = segSpeedKmh;
      }
    }

    const duration = (Date.now() - startTimeRef.current) / 1000;
    const avgSpeed = duration > 0 ? (totalDist / duration) * 3.6 : 0;

    setStats({
      distanceMeters: totalDist,
      durationSeconds: duration,
      elevationGain: elevGain,
      averageSpeedKmh: avgSpeed,
      maxSpeedKmh: maxSpeed,
    });
  }, []);

  const start = useCallback(() => {
    if (!navigator.geolocation) {
      setError("GPS no disponible en este dispositivo");
      return;
    }

    setError(null);
    setPoints([]);
    pointsRef.current = [];
    startTimeRef.current = Date.now();
    setIsTracking(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const point: GPSPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
          elevation: position.coords.altitude,
          accuracy: position.coords.accuracy,
        };

        pointsRef.current = [...pointsRef.current, point];
        setPoints(pointsRef.current);

        // Persistencia para resistir cierre accidental de app
        try {
          localStorage.setItem(
            "rastros_current_hike",
            JSON.stringify({
              startTime: startTimeRef.current,
              points: pointsRef.current,
            })
          );
        } catch (e) {
          // localStorage puede fallar en incognito, no bloquear
        }
      },
      (err) => {
        setError(`Error GPS: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    // Actualizar stats cada segundo aunque no llegue un punto nuevo
    intervalRef.current = setInterval(() => {
      recalcStats(pointsRef.current);
    }, 1000);
  }, [recalcStats]);

  const stop = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
    recalcStats(pointsRef.current);
  }, [recalcStats]);

  const reset = useCallback(() => {
    stop();
    setPoints([]);
    pointsRef.current = [];
    startTimeRef.current = null;
    setStats({
      distanceMeters: 0,
      durationSeconds: 0,
      elevationGain: 0,
      averageSpeedKmh: 0,
      maxSpeedKmh: 0,
    });
    try {
      localStorage.removeItem("rastros_current_hike");
    } catch (e) {}
  }, [stop]);

  // Recuperar hike en progreso si se cerró la app
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rastros_current_hike");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.points?.length > 0) {
          startTimeRef.current = data.startTime;
          pointsRef.current = data.points;
          setPoints(data.points);
          recalcStats(data.points);
        }
      }
    } catch (e) {}
  }, [recalcStats]);

  return {
    isTracking,
    points,
    stats,
    error,
    start,
    stop,
    reset,
  };
}
