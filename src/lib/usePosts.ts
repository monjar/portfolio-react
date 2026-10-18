import { useEffect, useState } from "react";
import { loadPosts, Post } from "./blog";

/* All posts, newest first. `null` until the manifest has loaded. */
export function usePosts(): Post[] | null {
  const [posts, setPosts] = useState<Post[] | null>(null);
  useEffect(() => {
    let live = true;
    loadPosts()
      .then((p) => live && setPosts(p))
      .catch(() => live && setPosts([]));
    return () => {
      live = false;
    };
  }, []);
  return posts;
}
