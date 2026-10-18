/* A work as an illuminated card: tilts toward the pointer, a gilded glow
   follows it, and the cover wakes into a muted preview loop on hover. */
import { useRef, useState } from "react";
import { Link } from "react-router";
import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Project } from "../../data/projects";
import { useCapabilities } from "../../lib/capabilities";
import Media, { HoverVideo } from "../Media/Media";
import SigilCover from "../SigilCover/SigilCover";
import StackChips from "../StackChips/StackChips";
import { ArrowGlyph } from "../icons";
import "./ProjectCard.css";

export default function ProjectCard({ p, num }: { p: Project; num: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { finePointer, reduced } = useCapabilities();
  const tilt = finePointer && !reduced;
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 180, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    mx.set(x);
    my.set(y);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const reset = () => {
    setHover(false);
    mx.set(0.5);
    my.set(0.5);
  };

  const cover = p.media.cover;
  const isLogo = cover?.src.endsWith("logo.webp");

  return (
    <m.div className="pcard-wrap reveal" style={tilt ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}>
      <Link
        ref={ref}
        to={`/works/${p.slug}`}
        className={`pcard ${hover ? "is-hover" : ""}`}
        style={{ ["--accent" as string]: p.accent ?? "var(--gold-2)" }}
        onPointerEnter={() => setHover(true)}
        onPointerMove={tilt ? onMove : undefined}
        onPointerLeave={reset}
        onFocus={() => setHover(true)}
        onBlur={reset}
      >
        <div className={`pcard__art ${isLogo ? "pcard__art--logo" : ""}`}>
          {cover ? <Media item={{ ...cover, aspect: undefined }} /> : <SigilCover slug={p.slug} title={p.title} accent={p.accent} />}
          {p.media.hoverVideo && <HoverVideo item={p.media.hoverVideo} active={hover} />}
          {p.media.hero && typeof p.media.hero !== "string" && p.media.hero.kind === "youtube" && (
            <span className="pcard__badge">▶ Film</span>
          )}
          {p.status && <span className="pcard__status">{p.status}</span>}
        </div>
        <div className="pcard__body">
          <div className="pcard__head">
            <span className="pcard__num">{num}</span>
            <span className="pcard__craft">{p.craft}</span>
          </div>
          <h3>{p.title}</h3>
          <p>{p.tagline}</p>
          <div className="pcard__foot">
            <StackChips stack={p.stack} compact max={6} />
            <span className="pcard__go" aria-hidden="true">
              <ArrowGlyph />
            </span>
          </div>
        </div>
        <span className="pcard__glow" aria-hidden="true" />
      </Link>
    </m.div>
  );
}
