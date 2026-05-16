/* ──────────────────────────────────────────────────────────────────────────
   Shared blog engine — file-based markdown.
   Posts live in /public/posts/*.md, listed in manifest.json.
   To publish: drop a new .md (with frontmatter) into public/posts/ and add its
   filename to public/posts/manifest.json.
   ────────────────────────────────────────────────────────────────────────── */

import { marked } from "marked";

export interface Post {
  slug: string;
  file: string;
  title: string;
  date: string;
  dateLabel: string;
  excerpt: string;
  tags: string[];
  minutes: number;
  body: string;
}

interface Frontmatter {
  meta: Record<string, string> & { tags?: string[] };
  body: string;
}

const POSTS_BASE = `${process.env.PUBLIC_URL || ""}/posts/`;

function parseFrontmatter(raw: string): Frontmatter {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, string> & { tags?: string[] } = {};
  m[1].split("\n").forEach((line) => {
    const i = line.indexOf(":");
    if (i === -1) return;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim();
    if (key === "tags") {
      meta.tags = val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      meta[key] = val;
    }
  });
  return { meta, body: m[2] };
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function fmtDate(d: string): string {
  const date = new Date(d + "T00:00:00");
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function slugFromFile(file: string): string {
  return file.replace(/\.md$/, "");
}

let cache: Promise<Post[]> | null = null;

export function loadPosts(): Promise<Post[]> {
  if (!cache) cache = fetchPosts();
  return cache;
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(POSTS_BASE + "manifest.json", { cache: "no-store" });
  const { posts } = (await res.json()) as { posts: string[] };
  const entries = await Promise.all(
    posts.map(async (file) => {
      const txt = await (
        await fetch(POSTS_BASE + file, { cache: "no-store" })
      ).text();
      const { meta, body } = parseFrontmatter(txt);
      return {
        slug: slugFromFile(file),
        file,
        title: meta.title || slugFromFile(file),
        date: meta.date || "",
        dateLabel: meta.date ? fmtDate(meta.date) : "",
        excerpt: meta.excerpt || "",
        tags: meta.tags || [],
        minutes: readingTime(body),
        body,
      } as Post;
    })
  );
  entries.sort((a, b) => (a.date < b.date ? 1 : -1));
  return entries;
}

export function renderMarkdown(body: string): string {
  marked.setOptions({ breaks: false, gfm: true });
  return marked.parse(body) as string;
}
