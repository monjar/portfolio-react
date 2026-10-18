import { useCallback, useEffect, useState } from "react";

/* light = Royal Parchment · dark = Emerald Wood.
   index.html picks the palette before first paint; this hook takes over from
   there. Storage is only written on an explicit toggle, so visitors who never
   choose keep following their OS. */
const LIGHT = "royal";
const DARK = "forest";
const KEY = "monjar-fan-mode";

export type Mode = "light" | "dark";

const current = (): Mode =>
  document.documentElement.dataset.palette === DARK ? "dark" : "light";

function apply(mode: Mode) {
  const root = document.documentElement;
  root.dataset.palette = mode === "dark" ? DARK : LIGHT;
  root.style.colorScheme = mode;
  window.dispatchEvent(new CustomEvent("palettechange", { detail: mode }));
}

export function useTheme() {
  const [mode, setMode] = useState<Mode>(current);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {}
    if (stored === "dark" || stored === "light") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      const m: Mode = mq.matches ? "dark" : "light";
      apply(m);
      setMode(m);
    };
    mq.addEventListener("change", follow);
    return () => mq.removeEventListener("change", follow);
  }, []);

  const toggle = useCallback(() => {
    const next: Mode = current() === "dark" ? "light" : "dark";
    apply(next);
    setMode(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  }, []);

  return { mode, toggle };
}
