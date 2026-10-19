/* PhoneFan: an app's screens as three phones, the middle one forward. Every
   few seconds the fan turns one screen along; the caption names the screen
   in front. Paused offscreen, while inactive, and under reduced motion
   (where the arrows still step through by hand). */
import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "../../data/projects";
import { asset } from "../../lib/media";
import { useCapabilities } from "../../lib/capabilities";
import "./PhoneFan.css";

interface Props {
  items: MediaItem[];
  active?: boolean;
  className?: string;
}

const STEP_MS = 3400;

export default function PhoneFan({ items, active = true, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [inView, setInView] = useState(false);
  const { reduced } = useCapabilities();
  const n = items.length;
  const turning = active && inView && !reduced;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!turning) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % n), STEP_MS);
    return () => window.clearInterval(id);
  }, [turning, n]);

  const role = (k: number) => {
    const d = (k - i + n) % n;
    if (d === 0) return "center";
    if (d === 1) return "right";
    if (d === n - 1) return "left";
    return d < n / 2 ? "after" : "before";
  };

  return (
    <div ref={root} className={`phonefan ${className}`}>
      <div className="phonefan__stage">
        {items.map((m, k) => (
          <figure key={m.src} className={`phonefan__phone phonefan__phone--${role(k)}`} aria-hidden={k !== i}>
            <img src={asset(m.src)} alt={k === i ? m.alt : ""} loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
      <div className="phonefan__hud">
        <button type="button" onClick={() => setI((i - 1 + n) % n)} aria-label="Previous screen">
          ‹
        </button>
        <span className="phonefan__cap" aria-live="polite">
          {items[i].caption ?? items[i].alt}
        </span>
        <button type="button" onClick={() => setI((i + 1) % n)} aria-label="Next screen">
          ›
        </button>
      </div>
    </div>
  );
}
