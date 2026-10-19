import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { archive, detailable, MediaItem, projects, slugAliases } from "./projects";
import { STACK } from "./stack";

const PUBLIC = join(__dirname, "../../public");

function files(m: MediaItem): string[] {
  if (m.kind === "youtube") return [];
  return [m.src, m.srcAlt, m.poster].filter(Boolean) as string[];
}

describe("projects", () => {
  it("has unique kebab-case slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("points every media item at a file that exists", () => {
    const missing: string[] = [];
    for (const p of projects) {
      const { cover, hoverVideo, hero, gallery = [], reel = [], screens = [] } = p.media;
      const items = [cover, hoverVideo, typeof hero === "object" ? hero : undefined, ...gallery, ...reel, ...screens, ...(p.sections ?? []).map((s) => s.media)];
      for (const m of items) if (m) for (const f of files(m)) if (!existsSync(join(PUBLIC, f))) missing.push(`${p.slug}: ${f}`);
    }
    expect(missing).toEqual([]);
  });

  it("gives every detail page a craft, tagline and summary", () => {
    for (const p of detailable) {
      expect(p.craft, p.slug).toMatch(/^Order of /);
      expect(p.tagline.length, p.slug).toBeGreaterThan(10);
      expect(p.summary.length, p.slug).toBeGreaterThan(40);
    }
  });

  it("links every archive entry to its repo", () => {
    for (const p of archive) expect(p.links.repo, p.slug).toMatch(/^https:\/\/github\.com\//);
  });

  it("points every alias at a real work", () => {
    for (const [from, to] of Object.entries(slugAliases)) {
      expect(projects.some((p) => p.slug === from), from).toBe(false);
      expect(projects.some((p) => p.slug === to), to).toBe(true);
    }
  });

  it("only uses known stack ids", () => {
    for (const p of projects) for (const id of p.stack) expect(STACK[id], `${p.slug}: ${id}`).toBeDefined();
  });
});
