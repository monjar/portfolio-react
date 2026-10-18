/* GildedFrame: a gold border that traces itself around its content as the
   frame scrolls into view, then blooms corner flourishes when complete. */
import { ReactNode, useRef } from "react";
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useCapabilities } from "../../lib/capabilities";
import "./GildedFrame.css";

interface Props {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}

export default function GildedFrame({ children, className = "", as = "div" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useCapabilities();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 30%"] });
  const eased = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.6 });
  const length = useTransform(eased, [0, 1], [0.02, 1]);
  const cornerOpacity = useTransform(eased, [0.85, 1], [0, 1]);
  const Tag = m[as];

  useMotionValueEvent(eased, "change", (v) => {
    ref.current?.classList.toggle("gilded--done", v > 0.98);
  });

  return (
    <Tag ref={ref} className={`gilded ${reduced ? "gilded--done" : ""} ${className}`}>
      <svg className="gilded__trace" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
        <m.rect
          x="0.5"
          y="0.5"
          width="99"
          height="99"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduced ? 1 : length }}
        />
      </svg>
      <m.span className="gilded__corners" aria-hidden="true" style={{ opacity: reduced ? 1 : cornerOpacity }}>
        <i /><i /><i /><i />
      </m.span>
      {children}
    </Tag>
  );
}
