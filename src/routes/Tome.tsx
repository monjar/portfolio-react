import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import Footer from "../components/Footer/Footer";
import { renderMarkdown } from "../lib/blog";
import { usePosts } from "../lib/usePosts";
import { useDocumentMeta } from "../lib/useDocumentMeta";
import "./codex.css";

const Tome = () => {
  const { slug } = useParams<{ slug: string }>();
  const posts = usePosts();

  const post = useMemo(
    () => posts?.find((p) => p.slug === slug),
    [posts, slug]
  );

  useDocumentMeta(post?.title, post?.excerpt);

  const [html, setHtml] = useState("");
  useEffect(() => {
    let live = true;
    if (post) renderMarkdown(post.body).then((h) => live && setHtml(h));
    return () => {
      live = false;
    };
  }, [post]);

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
