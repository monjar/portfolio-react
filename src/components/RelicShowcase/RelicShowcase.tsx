/* Chapter II · The Relics. On wide screens the four featured works take
   turns on a sticky stage as you scroll: text on the left, living media on the
   right. All four stay mounted and cross-fade by class, so a fast flick can
   never drop one mid-transition, and each relic owns more than a full
   screen of scroll so a normal flick can't carry you past it. Small screens and reduced
   motion get the same four as stacked, gilded panels. */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { m, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { relics, Project } from "../../data/projects";
import { useCapabilities } from "../../lib/capabilities";
import { useMedia } from "../../lib/useMedia";
import { roman } from "../../lib/roman";
import { inline } from "../../lib/inline";
import { longestWord } from "../../lib/text";
import GildedFrame from "../../effects/GildedFrame/GildedFrame";
import SectionHead from "../SectionHead/SectionHead";
import StackChips from "../StackChips/StackChips";
import Media from "../Media/Media";
import Reel from "../Reel/Reel";
import PhoneFan from "../PhoneFan/PhoneFan";
import MochiroDevice from "../MochiroDevice/MochiroDevice";
import SigilCover from "../SigilCover/SigilCover";
import { ArrowGlyph } from "../icons";
import "./RelicShowcase.css";

/* scroll (in vh) each relic holds the stage for */
const SEGMENT = 115;

function RelicMedia({ p, active = true }: { p: Project; active?: boolean }) {
  const hero = p.media.hero;
  if (hero === "mochiro-face") {
    return (
      <div className="relic-media relic-media--device">
        <MochiroDevice />
      </div>
    );
  }
  if (p.media.screens?.length) {
    return (
      <div className="relic-media relic-media--fan">
        <PhoneFan items={p.media.screens} active={active} />
      </div>
    );
  }
  if (p.media.reel?.length) {
    return (
      <div className="relic-media">
        <Reel items={p.media.reel} active={active} />
      </div>
    );
  }
  const item = hero ?? p.media.hoverVideo ?? p.media.cover;
  if (!item) return <SigilCover slug={p.slug} title={p.title} accent={p.accent} className="relic-media" />;
  return (
    <div className="relic-media">
      <Media item={{ ...item, aspect: undefined }} />
    </div>
  );
}

function RelicText({ p, i }: { p: Project; i: number }) {
  return (
    <>
      <div className="relic__num">{roman(i + 1)}</div>
      <div className="relic__craft">{p.craft}</div>
      <h3 className="relic__title" style={{ ["--len" as string]: longestWord(p.title) }}>
        {p.title}
      </h3>
      <p className="relic__tagline">{p.tagline}</p>
      <p className="relic__summary" dangerouslySetInnerHTML={{ __html: inline(p.summary) }} />
      {p.stats && (
        <dl className="relic__stats">
          {p.stats.slice(0, 3).map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <StackChips stack={p.stack} compact max={8} />
      <div className="relic__cta">
        <Link className="btn solid" to={`/works/${p.slug}`}>
          Unroll the scroll <ArrowGlyph />
        </Link>
        {(p.links.live || p.links.site) && (
          <a className="btn" href={p.links.live ?? p.links.site} target="_blank" rel="noopener noreferrer">
            {p.links.live ? "Enter the live realm" : "Visit the studio"}
          </a>
        )}
      </div>
    </>
  );
}

function Stage() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = relics.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n))));
  });

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.5) / n), behavior: "smooth" });
  };

  return (
    <div className="relics__scroller" ref={ref} style={{ height: `calc(${n * SEGMENT}vh + 100vh)` }}>
      <div className="relics__stage" style={{ ["--accent" as string]: relics[active].accent }}>
        <div className="relics__glow" aria-hidden="true" />
        <div className="relics__grid wrap">
          <div className="relic__texts">
            {relics.map((p, i) => (
              <div key={p.slug} className={`relic__text ${i === active ? "on" : ""}`} inert={i !== active} aria-hidden={i !== active}>
                <RelicText p={p} i={i} />
              </div>
            ))}
          </div>
          <div className="relic__stagebox">
            {relics.map((p, i) => (
              <div key={p.slug} className={`relic__mediawrap ${i === active ? "on" : ""}`} inert={i !== active} aria-hidden={i !== active}>
                <RelicMedia p={p} active={i === active} />
              </div>
            ))}
            <svg className="relic__runering" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="96" />
              <circle cx="100" cy="100" r="88" />
            </svg>
          </div>
          <nav className="relics__rail" aria-label="Relics">
            {relics.map((r, i) => (
              <button key={r.slug} className={i === active ? "on" : ""} onClick={() => jump(i)} aria-current={i === active}>
                <span className="relics__rail-num">{roman(i + 1)}</span>
                <span className="relics__rail-name">{r.title}</span>
              </button>
            ))}
            <m.span className="relics__bar" style={{ scaleY: bar }} aria-hidden="true" />
          </nav>
        </div>
      </div>
    </div>
  );
}

function StackedPanel({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <GildedFrame as="article" className="relic-panel">
      <div ref={ref} className="relic-panel__media" style={{ ["--accent" as string]: p.accent }}>
        <RelicMedia p={p} active={near} />
      </div>
      <div className="relic-panel__text">
        <RelicText p={p} i={i} />
      </div>
    </GildedFrame>
  );
}

export default function RelicShowcase() {
  const { reduced } = useCapabilities();
  const roomy = useMedia("(min-width: 960px) and (min-height: 600px)");
  const sticky = roomy && !reduced;
  return (
    <section className="relics" id="relics">
      <div className="sec" style={{ paddingBottom: 0 }}>
        <SectionHead
          chapter="Chapter II"
          lead="The"
          crimson="Relics"
          sub="Four things I've lately poured the most of myself into. Each one unrolls into its own scroll."
        />
      </div>
      {sticky ? (
        <Stage />
      ) : (
        <div className="relics__stack wrap">
          {relics.map((p, i) => (
            <StackedPanel key={p.slug} p={p} i={i} />
          ))}
        </div>
      )}
    </section>
  );
}
