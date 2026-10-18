/* Page-turn route transitions. A parchment leaf, hinged at the left edge,
   swings in over the old page and on out past the new one. The page itself
   only cross-fades underneath, so nothing long is ever 3D-transformed.
   Reduced motion gets a short cross-fade. */
import { ReactNode, useEffect, useRef } from "react";
import { m } from "motion/react";
import { useCapabilities } from "../../lib/capabilities";
import { Crest } from "../../components/icons";
import "./PageTurn.css";

const HALF = 0.42;

export default function PageTurn({ children }: { children: ReactNode }) {
  const { reduced } = useCapabilities();
  const ref = useRef<HTMLDivElement>(null);

  // move focus to the new page so keyboard & screen-reader users land on it
  useEffect(() => {
    const id = window.setTimeout(() => ref.current?.focus({ preventScroll: true }), reduced ? 160 : HALF * 1000 + 40);
    return () => window.clearTimeout(id);
  }, [reduced]);

  if (reduced) {
    return (
      <m.div
        ref={ref}
        tabIndex={-1}
        className="page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.15 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        {children}
      </m.div>
    );
  }

  return (
    <m.div
      ref={ref}
      tabIndex={-1}
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: HALF * 0.4 } }}
      exit={{ opacity: 0, transition: { duration: 0.2, delay: HALF * 0.6 } }}
    >
      <m.div
        className="page-leaf"
        aria-hidden="true"
        style={{ transformPerspective: 2400 }}
        initial={{ rotateY: 0, opacity: 1 }}
        animate={{ rotateY: -96, opacity: 1, transitionEnd: { opacity: 0 }, transition: { duration: HALF, ease: [0.55, 0, 0.75, 0.2] } }}
        exit={{ rotateY: [92, 0], opacity: 1, transition: { duration: HALF, ease: [0.25, 0.8, 0.45, 1] } }}
      >
        <div className="page-leaf__shade" />
        <Crest />
      </m.div>
      {children}
    </m.div>
  );
}
