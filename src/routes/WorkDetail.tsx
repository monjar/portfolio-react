/* /works/:slug: a project unrolled into its own scroll. */
import { useState } from "react";
import { Link, useParams } from "react-router";
import { bySlug, detailable, MediaItem, Project } from "../data/projects";
import { usePosts } from "../lib/usePosts";
import { useReveal } from "../lib/useReveal";
import { useDocumentMeta } from "../lib/useDocumentMeta";
import { roman } from "../lib/roman";
import { inline } from "../lib/inline";
import InkText from "../effects/InkText/InkText";
import GildedFrame from "../effects/GildedFrame/GildedFrame";
import Media from "../components/Media/Media";
import Reel from "../components/Reel/Reel";
import { longestWord } from "../lib/text";
import MochiroDevice from "../components/MochiroDevice/MochiroDevice";
import SigilCover from "../components/SigilCover/SigilCover";
import StackChips from "../components/StackChips/StackChips";
import Lightbox from "../components/Lightbox/Lightbox";
import Footer from "../components/Footer/Footer";
import { ArrowGlyph, ExternalGlyph, Fleuron, PlayGlyph } from "../components/icons";
import NotFound from "./NotFound";
import "./WorkDetail.css";

function Hero({ p }: { p: Project }) {
  const hero = p.media.hero;
  if (hero === "mochiro-face") {
    return (
      <div className="wd-hero__media wd-hero__media--device">
        <MochiroDevice />
      </div>
    );
  }
  if (p.media.reel?.length) {
    return (
      <div className="wd-hero__media">
        <Reel items={p.media.reel} />
      </div>
    );
  }
  const item = hero ?? p.media.hoverVideo ?? p.media.cover;
  return (
    <div className="wd-hero__media">
      {item ? (
        <Media item={item} eager poster={p.media.cover?.src} fit={item.src.endsWith("logo.webp") ? "contain" : "cover"} />
      ) : (
        <SigilCover slug={p.slug} title={p.title} accent={p.accent} />
      )}
    </div>
  );
}

function Links({ p }: { p: Project }) {
  const l = p.links;
  const out: { href: string; label: string }[] = [];
  if (l.live) out.push({ href: l.live, label: "Enter the live realm" });
  if (l.site) out.push({ href: l.site, label: "Visit the site" });
  if (l.store) out.push({ href: l.store, label: "Find it in the store" });
  if (l.repo) out.push({ href: l.repo, label: "Read the source" });
  if (l.npm) out.push({ href: l.npm, label: "npm package" });
  if (!out.length && !l.privateNote) return null;
  return (
    <div className="wd-links">
      {out.map((o, i) => (
        <a key={o.href} className={`btn ${i === 0 ? "solid" : ""}`} href={o.href} target="_blank" rel="noopener noreferrer">
          {o.label} <ExternalGlyph />
        </a>
      ))}
      {l.privateNote && <p className="wd-links__sealed">✦ {l.privateNote}</p>}
    </div>
  );
}

function Detail({ p }: { p: Project }) {
  const idx = detailable.indexOf(p);
  const prev = detailable[(idx - 1 + detailable.length) % detailable.length];
  const next = detailable[(idx + 1) % detailable.length];
  const posts = (usePosts() ?? []).filter((post) => p.posts?.includes(post.slug));
  const gallery: MediaItem[] = p.media.gallery ?? [];
  const [lb, setLb] = useState<number | null>(null);
  useDocumentMeta(p.title, `${p.title}: ${p.tagline}`);
  useReveal([p.slug, posts.length]);

  return (
    <main className="view work-detail" style={{ ["--accent" as string]: p.accent ?? "var(--gold-2)" }}>
      <section className="wd-hero">
        <div className="wd-hero__sky" aria-hidden="true" />
        <div className="wrap wd-hero__grid">
          <div className="wd-hero__text">
            <Link className="back-link" to="/" state={{ scrollTo: p.tier === "relic" ? "relics" : "work" }}>
              ← return to the works
            </Link>
            <div className="eyebrow sole hl d1">
              {roman(idx + 1)} · {p.craft}
            </div>
            <InkText
              as="h1"
              className="wd-title"
              parts={[p.title]}
              immediate
              delay={200}
              stagger={45}
              style={{ ["--len" as string]: longestWord(p.title) }}
            />
            <p className="wd-tagline hl d3">{p.tagline}</p>
          </div>
          <div className="wd-hero__unfurl hl d2">
            <Hero p={p} />
          </div>
        </div>
      </section>

      <div className="wd-ribbon">
        <div className="wrap wd-ribbon__inner">
          <dl>
            <div>
              <dt>Role</dt>
              <dd>{p.role}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{p.year}</dd>
            </div>
            {p.status && (
              <div>
                <dt>Status</dt>
                <dd>{p.status}</dd>
              </div>
            )}
            {p.stats?.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <StackChips stack={p.stack} />
        </div>
      </div>

      <div className="wrap wd-body">
        <p className="wd-summary dropcap reveal" dangerouslySetInnerHTML={{ __html: inline(p.summary) }} />
        <Links p={p} />

        {p.sections?.map((s, i) => (
          <GildedFrame key={s.heading} as="section" className={`wd-section ${s.media ? "wd-section--media" : ""} ${i % 2 ? "flip" : ""}`}>
            <div className="wd-section__text">
              <h2>
                <span aria-hidden="true">❦</span> {s.heading}
              </h2>
              {s.body.map((para, j) => (
                <p key={j} className="reveal" dangerouslySetInnerHTML={{ __html: inline(para) }} />
              ))}
            </div>
            {s.media && (
              <div className="wd-section__media reveal">
                <Media item={s.media} />
              </div>
            )}
          </GildedFrame>
        ))}

        {gallery.length > 0 && (
          <section className="wd-gallery">
            <h2 className="wd-gallery__title reveal">
              <span>The Gallery</span>
            </h2>
            <div className="wd-gallery__grid">
              {gallery.map((g, i) => (
                <button key={i} className="wd-gallery__item reveal" onClick={() => setLb(i)} aria-label={`Open: ${g.caption ?? g.alt}`}>
                  {g.kind === "video" && g.poster ? (
                    <>
                      <Media item={{ kind: "image", src: g.poster, alt: g.alt, aspect: g.aspect }} />
                      <span className="wd-gallery__play" aria-hidden="true">
                        <PlayGlyph />
                      </span>
                    </>
                  ) : (
                    <Media item={g} />
                  )}
                  {g.caption && <span className="wd-gallery__cap">{g.caption}</span>}
                </button>
              ))}
            </div>
            <Lightbox items={gallery} index={lb} onIndex={setLb} />
          </section>
        )}

        {posts.length > 0 && (
          <section className="wd-posts reveal">
            <div className="eyebrow">From the Codex</div>
            {posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="wd-post">
                <span className="wd-post__when">{post.dateLabel}</span>
                <span className="wd-post__title">{post.title}</span>
                <ArrowGlyph />
              </Link>
            ))}
          </section>
        )}
      </div>

      <Fleuron />
      <nav className="wd-pager wrap" aria-label="More works">
        <Link to={`/works/${prev.slug}`} className="wd-pager__link">
          <span className="wd-pager__dir">← Previous work</span>
          <span className="wd-pager__title">{prev.title}</span>
          <span className="wd-pager__craft">{prev.craft}</span>
        </Link>
        <Link to={`/works/${next.slug}`} className="wd-pager__link wd-pager__link--next">
          <span className="wd-pager__dir">Next work →</span>
          <span className="wd-pager__title">{next.title}</span>
          <span className="wd-pager__craft">{next.craft}</span>
        </Link>
      </nav>
      <Footer right={<Link to="/">← the keep</Link>} />
    </main>
  );
}

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const p = bySlug(slug);
  if (!p || p.tier === "archive") return <NotFound />;
  return <Detail key={p.slug} p={p} />;
}
