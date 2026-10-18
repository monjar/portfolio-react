import { useEffect } from "react";

const SITE = "The Codex of Monjar";

/* Title + meta description for the current page. */
export function useDocumentMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} — Forger of Automata & Realms`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    }
  }, [title, description]);
}
