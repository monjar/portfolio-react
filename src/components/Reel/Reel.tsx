/* Reel: a project's best clips, one after another. Each clip plays once and
   hands over to the next with a cross-fade; captions name what you're seeing
   and the dots jump between them. Only the playing clip and the one after it
   ever download, and nothing plays offscreen, inactive or under reduced
   motion (posters + dots instead). */
import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "../../data/projects";
import { asset } from "../../lib/media";
import { useCapabilities } from "../../lib/capabilities";
import "./Reel.css";

interface Props {
  items: MediaItem[];
  /** false pauses the reel (e.g. a relic that isn't on stage) */
  active?: boolean;
  className?: string;
}

const FALLBACK_MS = 12000; // advance even if a clip never fires `ended`

export default function Reel({ items, active = true, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const [i, setI] = useState(0);
  const [inView, setInView] = useState(false);
  const [armed, setArmed] = useState<number[]>([]);
  const [dur, setDur] = useState<Record<number, number>>({});
  const { reduced, saveData } = useCapabilities();
  const n = items.length;
  const playing = active && inView && !reduced && !saveData;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // attach sources for the current clip and the next one
  useEffect(() => {
    if (!playing) return;
    const want = [i, (i + 1) % n];
    setArmed((a) => (want.every((k) => a.includes(k)) ? a : [...new Set([...a, ...want])]));
  }, [playing, i, n]);

  // play the current clip from the top, pause the rest
  useEffect(() => {
    vids.current.forEach((v, k) => {
      if (!v) return;
      if (k === i && playing && armed.includes(k)) {
        if (v.ended || v.currentTime > 0.1) v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
    if (!playing) return;
    const id = window.setTimeout(() => setI((x) => (x + 1) % n), FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, [i, playing, armed, n]);

  const item = items[i];

  return (
    <div ref={root} className={`reel ${className}`}>
      {items.map((m, k) =>
        m.kind === "video" ? (
          <video
            key={m.src}
            ref={(el) => {
              vids.current[k] = el;
            }}
            className={`reel__clip ${k === i ? "on" : ""}`}
            muted
            playsInline
            preload="none"
            poster={m.poster ? asset(m.poster) : undefined}
            onEnded={() => k === i && setI((k + 1) % n)}
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration;
              if (isFinite(d)) setDur((x) => ({ ...x, [k]: d }));
            }}
            aria-hidden={k !== i}
          >
            {armed.includes(k) && <source src={asset(m.src)} type="video/webm" />}
            {armed.includes(k) && m.srcAlt && <source src={asset(m.srcAlt)} type="video/mp4" />}
          </video>
        ) : (
          <img key={m.src} className={`reel__clip ${k === i ? "on" : ""}`} src={asset(m.src)} alt="" loading="lazy" decoding="async" />
        )
      )}
      <div className="reel__hud">
        <span className="reel__cap" aria-live="polite">
          {item.caption ?? item.alt}
        </span>
        <span className="reel__dots">
          {items.map((m, k) => (
            <button
              key={m.src}
              type="button"
              className={k === i ? "on" : ""}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setI(k);
              }}
              aria-label={`Show ${m.caption ?? m.alt}`}
              aria-current={k === i}
            >
              {playing && k === i && dur[k] && <i key={i} style={{ animationDuration: `${dur[k]}s` }} />}
            </button>
          ))}
        </span>
      </div>
    </div>
  );
}
