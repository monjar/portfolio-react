/* One renderer for every MediaItem: lazy images, muted loops that only play
   while on screen, and YouTube behind a click-to-load facade (no third-party
   iframe until someone actually asks for the video). */
import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "../../data/projects";
import { asset } from "../../lib/media";
import { useCapabilities } from "../../lib/capabilities";
import { PlayGlyph } from "../icons";
import "./Media.css";

interface Props {
  item: MediaItem;
  className?: string;
  /** visible: loop while on screen · manual: show a play button */
  play?: "visible" | "manual";
  /** poster for a YouTube facade */
  poster?: string;
  eager?: boolean;
  fit?: "cover" | "contain";
}

export default function Media({ item, className = "", play = "visible", poster, eager = false, fit = "cover" }: Props) {
  const style = { aspectRatio: item.aspect, ["--fit" as string]: fit };
  if (item.kind === "image") {
    return (
      <img
        className={`media ${className}`}
        src={asset(item.src)}
        alt={item.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={style}
      />
    );
  }
  if (item.kind === "youtube") return <YouTubeFacade item={item} className={className} poster={poster} />;
  return <LoopVideo item={item} className={className} play={play} eager={eager} style={style} />;
}

function LoopVideo({
  item,
  className,
  play,
  eager,
  style,
}: {
  item: MediaItem;
  className: string;
  play: "visible" | "manual";
  eager: boolean;
  style: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const { reduced, saveData } = useCapabilities();
  const auto = play === "visible" && !reduced && !saveData;
  const [armed, setArmed] = useState(eager);
  const [want, setWant] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || !auto) return;
    const io = new IntersectionObserver(([e]) => setWant(e.isIntersecting), { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, [auto]);

  // sources mount on first play; the browser picks them up on insertion
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (want && !armed) return setArmed(true);
    if (want) v.play().then(() => setPlaying(true)).catch(() => {});
    else v.pause();
  }, [want, armed]);

  const start = () => setWant(true);

  return (
    <div className={`media media--video ${className}`} style={style}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={item.poster ? asset(item.poster) : undefined}
        aria-label={item.alt}
        controls={!auto && playing}
      >
        {armed && <source src={asset(item.src)} type="video/webm" />}
        {armed && item.srcAlt && <source src={asset(item.srcAlt)} type="video/mp4" />}
      </video>
      {!auto && !playing && (
        <button className="media__play" onClick={start} aria-label={`Play: ${item.alt}`}>
          <PlayGlyph />
        </button>
      )}
    </div>
  );
}

function YouTubeFacade({ item, className, poster }: { item: MediaItem; className: string; poster?: string }) {
  const [on, setOn] = useState(false);
  const thumb = poster ? asset(poster) : `https://i.ytimg.com/vi/${item.src}/hqdefault.jpg`;
  return (
    <div className={`media media--yt ${className}`} style={{ aspectRatio: item.aspect ?? "16/9" }}>
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${item.src}?autoplay=1&rel=0`}
          title={item.alt}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button className="media__yt-facade" onClick={() => setOn(true)} aria-label={`Play video: ${item.alt}`}>
          <img src={thumb} alt="" loading="lazy" decoding="async" />
          <span className="media__play" aria-hidden="true">
            <PlayGlyph />
          </span>
        </button>
      )}
    </div>
  );
}

/* A card's hover preview: sources are only attached after a short hover
   intent, so browsing the grid downloads nothing but posters. */
export function HoverVideo({ item, active }: { item: MediaItem; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const { reduced, saveData } = useCapabilities();

  const [intent, setIntent] = useState(false);

  useEffect(() => {
    if (!active) return setIntent(false);
    const id = window.setTimeout(() => setIntent(true), 150);
    return () => window.clearTimeout(id);
  }, [active]);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced || saveData) return;
    if (intent && !armed) return setArmed(true);
    if (intent) v.play().catch(() => {});
    else v.pause();
  }, [intent, armed, reduced, saveData]);

  if (reduced || saveData) return null;
  return (
    <video ref={ref} className={`hover-video ${intent && armed ? "on" : ""}`} muted loop playsInline preload="none" aria-hidden="true">
      {armed && <source src={asset(item.src)} type="video/webm" />}
      {armed && item.srcAlt && <source src={asset(item.srcAlt)} type="video/mp4" />}
    </video>
  );
}
