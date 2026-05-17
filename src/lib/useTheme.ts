import { useCallback, useEffect, useState } from "react";

/* light = Royal Parchment · dark = Emerald Wood */
const LIGHT = "royal";
const DARK = "forest";
const KEY = "monjar-fan-mode";

type Mode = "light" | "dark";

function initialMode(): Mode {
  const stored = localStorage.getItem(KEY);
  return stored === "dark" ? "dark" : "light";
}

export function useTheme() {
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-palette",
      mode === "dark" ? DARK : LIGHT
    );
    localStorage.setItem(KEY, mode);
  }, [mode]);

  const toggle = useCallback(
    () => setMode((m) => (m === "dark" ? "light" : "dark")),
    []
  );

  return { mode, toggle };
}
