/* Hand-authored heraldic SVGs from the design — crest (with mustache),
   book glyph, day/night toggle icons — and the sprite-frame dragon. */
import dragonSheet from "../assets/dragon-sheet.png";

export const Crest = () => (
  <svg className="crest" viewBox="0 0 22 26" fill="currentColor" aria-hidden="true">
    <path d="M11 0 22 4v9c0 7-5 11-11 13C5 24 0 20 0 13V4z" />
    <path
      className="tash"
      d="M11 11C10 10.4 9 10.3 8 10.5 6.2 10.8 4.8 11.6 3.6 12.8 3 13.4 3.2 14.2 3.9 14.1 4.5 14 4.6 13.3 5.1 12.9 6 12.2 7.2 12 8.4 12.2 9.3 12.35 10.2 12.6 11 13.1 11.8 12.6 12.7 12.35 13.6 12.2 14.8 12 16 12.2 16.9 12.9 17.4 13.3 17.5 14 18.1 14.1 18.8 14.2 19 13.4 18.4 12.8 17.2 11.6 15.8 10.8 14 10.5 13 10.3 12 10.4 11 11Z"
    />
  </svg>
);

export const BookGlyph = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 5.5C10 4.5 9 3.7 7.8 3.7H3.5v10.6h4.3c1.2 0 2.2.8 2.2 1.8z" />
    <path d="M10 5.5C10 4.5 11 3.7 12.2 3.7h4.3v10.6h-4.3c-1.2 0-2.2.8-2.2 1.8z" />
  </svg>
);

export const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
  </svg>
);

export const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
  >
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z" />
  </svg>
);

/* Sprite-frame dragon — the wing flap lives in the sheet's 28 frames, cycled
   by the `drake` steps() animation in CSS; flight is the separate `flyN`. */
export const Dragon = ({ variant }: { variant: "d1" | "d2" | "d3" }) => (
  <div
    className={`dragon ${variant}`}
    aria-hidden="true"
    style={{ backgroundImage: `url(${dragonSheet})` }}
  />
);

export const Fleuron = () => (
  <div className="fleuron">
    <span className="rule" />
    <span className="mark">❖</span>
    <span className="rule" />
  </div>
);
