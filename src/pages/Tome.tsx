import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { loadPosts, Post, renderMarkdown } from "../lib/blog";

const Tome = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPosts()
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

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
    <main className="view">
      <article className="tome">
        <div className="tome-wrap">
          {posts === null ? null : !post ? (
            <p className="prose">This scroll has been lost to time.</p>
          ) : (
            <>
              <a
                className="back-link"
                href="#/blog"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/blog");
                }}
              >
                ← return to the codex
              </a>
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
        right={
          <a
            href="#/blog"
            onClick={(e) => {
              e.preventDefault();
              navigate("/blog");
            }}
          >
            ← the codex
          </a>
        }
      />
    </main>
  );
};

export default Tome;
