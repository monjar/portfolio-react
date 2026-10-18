/* InkText: letters bleed onto the page one by one, each landing with a gilded
   flare, as if inked by a quill. Screen readers get the plain string. */
import { ElementType, useRef } from "react";
import { useInView } from "../../lib/useInView";
import "./InkText.css";

interface Part {
  text: string;
  className?: string;
}

interface Props {
  as?: ElementType;
  parts: (string | Part)[];
  className?: string;
  /** start on mount instead of when scrolled into view */
  immediate?: boolean;
  /** ms before the first letter */
  delay?: number;
  /** ms between letters */
  stagger?: number;
}

export default function InkText({ as: Tag = "span", parts, className = "", immediate = false, delay = 0, stagger = 38 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref);
  const on = immediate || seen;
  const norm = parts.map((p) => (typeof p === "string" ? { text: p } : p));
  const label = norm.map((p) => p.text).join("");
  let i = 0;

  return (
    <Tag ref={ref} className={`ink-text ${on ? "inked" : ""} ${className}`} aria-label={label}>
      {norm.map((part, pi) => (
        <span key={pi} className={part.className} aria-hidden="true">
          {part.text.split(/(\s+)/).map((word, wi) =>
            /^\s+$/.test(word) ? (
              <span key={wi}> </span>
            ) : (
              <span key={wi} className="ink-word">
                {[...word].map((ch, ci) => (
                  <span key={ci} className="ink-ch" style={{ animationDelay: `${delay + i++ * stagger}ms` }}>
                    {ch}
                  </span>
                ))}
              </span>
            )
          )}
        </span>
      ))}
    </Tag>
  );
}
