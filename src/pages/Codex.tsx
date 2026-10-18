import { useEffect } from "react";
import { Link } from "react-router";
import Footer from "../components/Footer";
import { usePosts } from "../lib/usePosts";
import { useReveal } from "../lib/useReveal";

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const Codex = () => {
  const posts = usePosts() ?? [];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "The Codex of Monjar";
  }, []);

  useReveal([posts]);

  return (
    <main className="view codex-view">
      <section className="codex-head">
        <div className="wrap">
          <Link className="back-link" to="/">
            ← return to the keep
          </Link>
          <div className="eyebrow sole" style={{ justifyContent: "center" }}>
            The Codex
          </div>
          <h1>
            Notes from the <span className="crimson">forge</span>
          </h1>
        </div>
      </section>

      <div className="wrap">
        <div className="codex-list">
          {posts.map((p, i) => (
            <Link
              key={p.slug}
              className="codex-card reveal"
              to={`/blog/${p.slug}`}
            >
              <div className="num">{ROMAN[i + 1] || i + 1}</div>
              <div>
                <span className="when">
                  {p.dateLabel} · {p.minutes} min
                </span>
                <h2>{p.title}</h2>
                <p className="ex">{p.excerpt}</p>
                <div className="tags">
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer right="Writings on robots & realms" />
    </main>
  );
};

export default Codex;
