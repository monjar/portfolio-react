import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router";
import Footer from "../components/Footer";
import { renderMarkdown } from "../lib/blog";
import { usePosts } from "../lib/usePosts";

const Tome = () => {
  const { slug } = useParams<{ slug: string }>();
  const posts = usePosts();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const post = useMemo(
    () => posts?.find((p) => p.slug === slug),
    [posts, slug]
  );

  useEffect(() => {
    if (post) document.title = `${post.title} · The Codex of Monjar`;
  }, [post]);

  const html = useMemo(
    () => (post ? renderMarkdown(post.body) : ""),
    [post]
  );

  return (
    <main className="view codex-view">
      <article className="tome">
        <div className="tome-wrap">
          {posts === null ? null : !post ? (
            <p className="prose">This scroll has been lost to time.</p>
          ) : (
            <>
              <Link className="back-link" to="/blog">
                ← return to the codex
              </Link>
              <header>
                <div className="when">
                  {post.dateLabel} · {post.minutes} min
                </div>
                <h1>{post.title}</h1>
                <div className="tags">
                  {post.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </header>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </>
          )}
        </div>
      </article>
      <Footer
        right={<Link to="/blog">← the codex</Link>}
      />
    </main>
  );
};

export default Tome;
