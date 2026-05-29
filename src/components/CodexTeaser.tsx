import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadPosts, Post } from "../lib/blog";
import { useReveal } from "../lib/useReveal";

const CodexTeaser = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts()
      .then((p) => setPosts(p.slice(0, 3)))
      .catch(() => setPosts([]));
  }, []);

  // Teaser posts arrive after the page's initial reveal pass — observe them
  // once they're mounted so they fade in instead of staying hidden.
  useReveal([posts]);

  return (
    <section className="sec" id="writing">
      <div className="sec-head">
        <div className="eyebrow">Chapter IV</div>
        <h2>
          From the <span className="crimson">Codex</span>
        </h2>
      </div>
      <div className="scrolls">
        {posts.map((p) => (
          <a
            key={p.slug}
            className="scroll-row reveal"
            href={`#/blog/${p.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/blog/${p.slug}`);
            }}
          >
            <div>
              <h4>{p.title}</h4>
              <p>{p.excerpt}</p>
            </div>
            <div className="when">{p.dateLabel}</div>
          </a>
        ))}
      </div>
      <div className="center-cta">
        <button className="btn" onClick={() => navigate("/blog")}>
          Read the full codex →
        </button>
      </div>
    </section>
  );
};

export default CodexTeaser;
