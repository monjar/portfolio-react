import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { loadPosts, Post } from "../lib/blog";
import { useReveal } from "../lib/useReveal";

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const Codex = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "The Codex of Monjar";
    loadPosts()
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  useReveal([posts]);

  return (
    <main className="view codex-view">
      <section className="codex-head">
        <div className="wrap">
          <a
            className="back-link"
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            ← return to the keep
          </a>
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
            <a
              key={p.slug}
              className="codex-card reveal"
              href={`#/blog/${p.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/blog/${p.slug}`);
              }}
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
            </a>
          ))}
        </div>
      </div>

      <Footer right="Writings on robots & realms" />
    </main>
  );
};

export default Codex;
