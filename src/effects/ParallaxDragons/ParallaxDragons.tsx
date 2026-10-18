/* Three depths of dragons. Each layer keeps the sprite's own wing-flap and
   flight path, and adds scroll parallax (far layers drift least) plus a little
   pointer parallax on desktop, so the sky reads as deep rather than flat. */
import { useEffect } from "react";
import { m, MotionValue, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { Dragon } from "../../components/icons";
import { useCapabilities } from "../../lib/capabilities";
import "./ParallaxDragons.css";

const LAYERS = [
  { variant: "d3", depth: 0.15, cls: "far" },
  { variant: "d2", depth: 0.4, cls: "mid" },
  { variant: "d1", depth: 0.8, cls: "near" },
] as const;

function Layer({
  depth,
  cls,
  variant,
  scrollY,
  px,
  py,
}: (typeof LAYERS)[number] & { scrollY: MotionValue<number>; px: MotionValue<number>; py: MotionValue<number> }) {
  const y = useTransform([scrollY, py], ([s, p]: number[]) => s * depth * 0.6 + p * depth * 26);
  const x = useTransform(px, (p) => p * depth * 40);
  return (
    <m.div className={`pdragons__layer pdragons__layer--${cls}`} style={{ x, y }}>
      <Dragon variant={variant} />
    </m.div>
  );
}

export default function ParallaxDragons() {
  const { reduced, finePointer } = useCapabilities();
  const { scrollY } = useScroll();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 40, damping: 18 });
  const py = useSpring(rawY, { stiffness: 40, damping: 18 });
  const still = useMotionValue(0);

  useEffect(() => {
    if (reduced || !finePointer) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(-(e.clientX / window.innerWidth - 0.5));
      rawY.set(-(e.clientY / window.innerHeight - 0.5));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, finePointer, rawX, rawY]);

  return (
    <div className="pdragons" aria-hidden="true">
      {LAYERS.map((l) => (
        <Layer key={l.cls} {...l} scrollY={reduced ? still : scrollY} px={px} py={py} />
      ))}
    </div>
  );
}
