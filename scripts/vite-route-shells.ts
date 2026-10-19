/* Vite plugin: after the build, write a real index.html for every client
   route (works/<slug>/, blog/, blog/<slug>/) with its own title, description
   and share image. GitHub Pages then answers deep links with 200 and proper
   link previews, and 404.html only catches paths that truly don't exist. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Plugin } from "vite";
import { detailable, slugAliases } from "../src/data/projects.ts";

const SITE = "https://monjar.dev";
const NAME = "The Codex of Monjar";
/* paths served by other repos' Pages under the same domain */
const RESERVED = ["Advanced-Shaders", "Advanced-Procedural-Animations-Study"];

interface Meta {
  path: string;
  title: string;
  description: string;
  image?: string;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function shell(html: string, m: Meta) {
  const url = `${SITE}/${m.path}`;
  const image = m.image ? `${SITE}/${m.image}` : `${SITE}/og.jpg`;
  const title = `${m.title} · ${NAME}`;
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description"\s+content=")[^"]*(")/, `$1${esc(m.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(m.description)}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${image}$2`)
    .replace("</head>", `    <link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />\n  </head>`);
}

function posts(root: string): Meta[] {
  const dir = join(root, "public/posts");
  const { posts } = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8")) as { posts: string[] };
  return posts.map((file) => {
    const raw = readFileSync(join(dir, file), "utf8");
    const fm = raw.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] ?? "";
    const get = (k: string) => fm.match(new RegExp(`^${k}:\\s*(.*)$`, "m"))?.[1].trim() ?? "";
    const slug = file.replace(/\.md$/, "");
    return { path: `blog/${slug}/`, title: get("title") || slug, description: get("excerpt") || get("title") };
  });
}

export default function routeShells(): Plugin {
  let outDir = "build";
  let root = process.cwd();
  return {
    name: "route-shells",
    apply: "build",
    configResolved(c) {
      root = c.root;
      outDir = resolve(c.root, c.build.outDir);
    },
    closeBundle() {
      const html = readFileSync(join(outDir, "index.html"), "utf8");
      const routes: Meta[] = [
        ...detailable.map((p) => {
          const og = `media/${p.slug}/og.jpg`;
          const image = existsSync(join(root, "public", og)) ? og : undefined;
          return { path: `works/${p.slug}/`, title: p.title, description: `${p.tagline} ${p.summary}`.slice(0, 280), image };
        }),
        { path: "blog/", title: "The Codex", description: "Notes from the forge: writings on robots, renderers and realms by Amirali Monjar." },
        ...posts(root),
      ];
      for (const r of routes) {
        if (RESERVED.some((x) => r.path.startsWith(x))) throw new Error(`route-shells: ${r.path} collides with another Pages site`);
        const dir = join(outDir, r.path);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "index.html"), shell(html, r));
      }
      // renamed works: a tiny page that forwards to the new address
      for (const [from, to] of Object.entries(slugAliases)) {
        const dir = join(outDir, `works/${from}`);
        mkdirSync(dir, { recursive: true });
        const url = `${SITE}/works/${to}/`;
        writeFileSync(
          join(dir, "index.html"),
          `<!doctype html><meta charset="utf-8"><title>Moved</title><link rel="canonical" href="${url}"><meta http-equiv="refresh" content="0; url=/works/${to}/"><script>location.replace("/works/${to}/" + location.search + location.hash)</script><a href="/works/${to}/">This work has moved.</a>\n`
        );
      }
      this.info?.(`wrote ${routes.length} route shells, ${Object.keys(slugAliases).length} redirect(s)`);
    },
  };
}
