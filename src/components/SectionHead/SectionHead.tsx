import { ReactNode } from "react";
import InkText from "../../effects/InkText/InkText";

interface Props {
  chapter: string;
  /** plain words before the crimson word */
  lead?: string;
  crimson: string;
  sub?: ReactNode;
}

/* "Chapter II · The Works": eyebrow, inked heading, optional subtitle. */
export default function SectionHead({ chapter, lead, crimson, sub }: Props) {
  return (
    <div className="sec-head">
      <div className="eyebrow reveal">{chapter}</div>
      <InkText as="h2" parts={[...(lead ? [lead + " "] : []), { text: crimson, className: "crimson" }]} />
      {sub && <p className="sub reveal">{sub}</p>}
    </div>
  );
}
