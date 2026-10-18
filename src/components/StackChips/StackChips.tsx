import { STACK, StackId } from "../../data/stack";
import { RUNES } from "../icons";
import "./StackChips.css";

interface Props {
  stack: StackId[];
  /** icons only (cards) vs labelled chips (detail pages) */
  compact?: boolean;
  max?: number;
}

export default function StackChips({ stack, compact = false, max }: Props) {
  const shown = max ? stack.slice(0, max) : stack;
  const rest = max ? stack.length - shown.length : 0;
  return (
    <ul className={`stack-chips ${compact ? "stack-chips--compact" : ""}`} aria-label="Built with">
      {shown.map((id, i) => {
        const { label, Icon } = STACK[id] as { label: string; Icon?: React.ComponentType<{ "aria-hidden"?: boolean }> };
        return (
          <li key={id} title={label}>
            {Icon ? <Icon aria-hidden /> : <span className="stack-chips__rune" aria-hidden="true">{RUNES[i % RUNES.length]}</span>}
            <span className={compact ? "sr-only" : undefined}>{label}</span>
          </li>
        );
      })}
      {rest > 0 && <li className="stack-chips__more">+{rest}</li>}
    </ul>
  );
}
