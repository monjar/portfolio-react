/* A deterministic heraldic sigil for projects without art: the slug seeds
   the star, the ring of runes and the rotation, so every project gets its own
   seal and it never changes between builds. */
import { RUNES } from "../icons";
import "./SigilCover.css";

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

interface Props {
  slug: string;
  title: string;
  accent?: string;
  className?: string;
}

export default function SigilCover({ slug, title, accent = "var(--gold-2)", className = "" }: Props) {
  const rnd = hash(slug);
  const points = 5 + Math.floor(rnd() * 4); // 5–8 point star
  const step = 2 + Math.floor(rnd() * (points / 2 - 1));
  const rot = rnd() * 360;
  const star = Array.from({ length: points }, (_, i) => {
    const a = ((i * step) / points) * Math.PI * 2 - Math.PI / 2;
    return `${100 + Math.cos(a) * 58},${100 + Math.sin(a) * 58}`;
  }).join(" ");
  const runeCount = 16;
  const runes = Array.from({ length: runeCount }, () => RUNES[Math.floor(rnd() * RUNES.length)]);
  const letter = title.replace(/[^A-Za-z0-9]/g, "")[0] ?? "✦";

  return (
    <div className={`sigil ${className}`} style={{ ["--sigil" as string]: accent }} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="sigil__svg">
        <g className="sigil__spin" style={{ transform: `rotate(${rot}deg)` }}>
          <circle cx="100" cy="100" r="86" className="sigil__ring" />
          <circle cx="100" cy="100" r="70" className="sigil__ring sigil__ring--thin" />
          {runes.map((r, i) => {
            const a = (i / runeCount) * 360;
            return (
              <text key={i} className="sigil__rune" x="100" y="22" transform={`rotate(${a} 100 100)`} textAnchor="middle">
                {r}
              </text>
            );
          })}
          <polygon points={star} className="sigil__star" />
        </g>
        <circle cx="100" cy="100" r="30" className="sigil__boss" />
        <text x="100" y="112" textAnchor="middle" className="sigil__letter">
          {letter}
        </text>
      </svg>
    </div>
  );
}
