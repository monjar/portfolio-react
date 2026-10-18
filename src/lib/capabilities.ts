import { useSyncExternalStore } from "react";

/* What this visitor's device can afford. Every effect gates on these, so the
   page degrades to a still, readable codex instead of breaking. */
export interface Capabilities {
  reduced: boolean;
  finePointer: boolean;
  narrow: boolean;
  saveData: boolean;
  lowPower: boolean;
  webgl2: boolean;
}

const queries = {
  reduced: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
  narrow: "(max-width: 760px)",
};

let webgl2: boolean | null = null;
function hasWebGL2() {
  if (webgl2 === null) {
    try {
      webgl2 = !!document.createElement("canvas").getContext("webgl2");
    } catch {
      webgl2 = false;
    }
  }
  return webgl2;
}

function read(): Capabilities {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  return {
    reduced: matchMedia(queries.reduced).matches,
    finePointer: matchMedia(queries.finePointer).matches,
    narrow: matchMedia(queries.narrow).matches,
    saveData: !!nav.connection?.saveData,
    lowPower: (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4,
    webgl2: hasWebGL2(),
  };
}

let snapshot: Capabilities | null = null;
const getSnapshot = () => (snapshot ??= read());

function subscribe(cb: () => void) {
  const mqls = Object.values(queries).map((q) => matchMedia(q));
  const on = () => {
    snapshot = read();
    cb();
  };
  mqls.forEach((m) => m.addEventListener("change", on));
  return () => mqls.forEach((m) => m.removeEventListener("change", on));
}

export function useCapabilities(): Capabilities {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
