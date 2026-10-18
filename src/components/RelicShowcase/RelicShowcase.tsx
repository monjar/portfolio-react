/* Chapter II · The Relics. On wide screens the four featured works take
   turns on a sticky stage as you scroll: text on the left, living media on the
   right, a rune-circle wipe between them. Small screens and reduced motion
   get the same four as stacked, gilded panels. */
import { useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, m, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { relics, Project } from "../../data/projects";
import { useCapabilities } from "../../lib/capabilities";
import { roman } from "../../lib/roman";
import { inline } from "../../lib/inline";
import GildedFrame from "../../effects/GildedFrame/GildedFrame";
import SectionHead from "../SectionHead/SectionHead";
import StackChips from "../StackChips/StackChips";
import Media from "../Media/Media";
import MochiroDevice from "../MochiroDevice/MochiroDevice";
import SigilCover from "../SigilCover/SigilCover";
import { ArrowGlyph } from "../icons";
import "./RelicShowcase.css";

function RelicMedia({ p, eager = false }: { p: Project; eager?: boolean }) {
  const hero = p.media.hero;
  if (hero === "mochiro-face") {
    return (
      <div className="relic-media relic-media--device">
        <MochiroDevice />
      </div>
    );
  }
  const item = hero ?? p.media.hoverVideo ?? p.media.cover;
  if (!item) return <SigilCover slug={p.slug} title={p.title} accent={p.accent} className="relic-media" />;
  return (
    <div className="relic-media">
      <Media item={{ ...item, aspect: undefined }} eager={eager} />
    </div>
  );
}

function RelicText({ p, i }: { p: Project; i: number }) {
  return (
    <>
      <div className="relic__num">{roman(i + 1)}</div>
      <div className="relic__craft">{p.craft}</div>
      <h3 className="relic__title">{p.title}</h3>
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(relics.length - 1, Math.max(0, Math.floor(v * relics.length)));
    setActive(i);
  });

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.5) / relics.length), behavior: "smooth" });
  };

  const p = relics[active];

  return (
    <div className="relics__scroller" ref={ref} style={{ height: `${relics.length * 100}vh` }}>
      <div className="relics__stage" style={{ ["--accent" as string]: p.accent }}>
        <div className="relics__glow" aria-hidden="true" />
        <div className="relics__grid wrap">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={p.slug}
              className="relic__text"
              initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <RelicText p={p} i={active} />
            </m.div>
          </AnimatePresence>
          <div className="relic__stagebox">
            <AnimatePresence initial={false}>
              <m.div
                key={p.slug}
                className="relic__mediawrap"
                initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0.4 }}
                animate={{ clipPath: "circle(75% at 50% 50%)", opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.3 } }}
                transition={{ duration: 0.9, ease: [0.65, 0.05, 0.36, 1] }}
              >
                <RelicMedia p={p} eager />
              </m.div>
            </AnimatePresence>
            <svg className="relic__runering" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="96" />
              <circle cx="100" cy="100" r="88" />
            </svg>
          </div>
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
  );
}

function Stacked() {
  return (
    <div className="relics__stack wrap">
      {relics.map((p, i) => (
        <GildedFrame key={p.slug} as="article" className="relic-panel">
          <div className="relic-panel__media" style={{ ["--accent" as string]: p.accent }}>
            <RelicMedia p={p} />
          </div>
          <div className="relic-panel__text">
            <RelicText p={p} i={i} />
          </div>
        </GildedFrame>
      ))}
    </div>
  );
}

export default function RelicShowcase() {
  const { reduced, narrow } = useCapabilities();
  const [wide] = useState(() => typeof window !== "undefined" && window.innerWidth >= 960);
  const sticky = !reduced && !narrow && wide;
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
      {sticky ? <Stage /> : <Stacked />}
    </section>
  );
}
