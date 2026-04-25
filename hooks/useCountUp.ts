import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 (or previous value) to target over `duration` ms.
 * Re-animates only if value changes by more than 1%.
 */
export function useCountUp(target: number, duration = 600): number {
  const [display, setDisplay] = useState(0);
  const prevTarget = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const safeTarget = Number.isFinite(target) ? target : 0;
    const prev = prevTarget.current;

    // Skip animation if change is less than 1%
    if (prev > 0 && Math.abs(safeTarget - prev) / prev < 0.01) {
      setDisplay(safeTarget);
      prevTarget.current = safeTarget;
      return;
    }

    const startTime = performance.now();
    const startValue = prev;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (safeTarget - startValue) * eased);
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevTarget.current = safeTarget;
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}
