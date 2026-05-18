import { useEffect } from "react";

/* Adds the `in` class to `.reveal` elements as they scroll into view.
   Re-runs whenever `deps` change so freshly-mounted content is observed. */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );
    document
      .querySelectorAll<HTMLElement>(".reveal:not(.in)")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
