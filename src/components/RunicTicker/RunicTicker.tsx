/* A slow marquee of everything the works were forged with, separated by
   futhark runes. It leans into fast scrolling and pauses under the cursor. */
import { m, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { detailable } from "../../data/projects";
import { STACK, StackId } from "../../data/stack";
import { RUNES } from "../icons";
import { useCapabilities } from "../../lib/capabilities";
import "./RunicTicker.css";

const ids = [...new Set(detailable.flatMap((p) => p.stack))] as StackId[];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="ticker__row" aria-hidden={hidden || undefined} aria-label={hidden ? undefined : "Tools of the trade"}>
      {ids.map((id, i) => {
        const { label, Icon } = STACK[id] as { label: string; Icon?: React.ComponentType };
        return (
          <li key={id}>
            {Icon && <Icon />}
            {label}
            <span className="ticker__rune" aria-hidden="true">
              {RUNES[i % RUNES.length]}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function RunicTicker() {
  const { reduced } = useCapabilities();
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const skew = useSpring(useTransform(v, [-2500, 0, 2500], [5, 0, -5], { clamp: true }), { stiffness: 200, damping: 40 });

  return (
    <div className="ticker" role="region" aria-label="Tools of the trade">
      <m.div style={{ skewX: reduced ? 0 : skew }}>
        <div className="ticker__track">
          <Row />
          <Row hidden />
        </div>
      </m.div>
    </div>
  );
}
