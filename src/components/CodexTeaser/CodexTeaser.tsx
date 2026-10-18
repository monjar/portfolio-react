import { Link } from "react-router";
import { usePosts } from "../../lib/usePosts";
import { useReveal } from "../../lib/useReveal";
import SectionHead from "../SectionHead/SectionHead";
import "./CodexTeaser.css";

const CodexTeaser = () => {
  const posts = (usePosts() ?? []).slice(0, 3);

  // Teaser posts arrive after the page's initial reveal pass — observe them
  // once they're mounted so they fade in instead of staying hidden.
  useReveal([posts.length]);

  return (
    <section className="sec" id="writing">
      <SectionHead chapter="Chapter V" lead="From the" crimson="Codex" />
      <div className="scrolls">
        {posts.map((p) => (
          <Link key={p.slug} className="scroll-row reveal" to={`/blog/${p.slug}`}>
            <div>
              <h4>{p.title}</h4>
              <p>{p.excerpt}</p>
            </div>
            <div className="when">{p.dateLabel}</div>
          </Link>
        ))}
      </div>
      <div className="center-cta">
        <Link className="btn" to="/blog">
          Read the full codex →
        </Link>
      </div>
    </section>
  );
};

export default CodexTeaser;
