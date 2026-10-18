import { Link } from "react-router";
import ArcaneSky from "../effects/ArcaneSky/ArcaneSky";
import { Dragon } from "../components/icons";
import { useDocumentMeta } from "../lib/useDocumentMeta";
import "./NotFound.css";

/* Lost in the wilds: unknown paths and unknown works land here. */
export default function NotFound() {
  useDocumentMeta("Lost in the Wilds");
  return (
    <main className="view lost">
      <ArcaneSky still />
      <div className="lost__dragon" aria-hidden="true">
        <Dragon variant="d1" />
      </div>
      <div className="wrap lost__inner">
        <div className="eyebrow hl d1">Error CDIV</div>
        <h1 className="hl d2">
          Lost in the <span className="crimson">wilds</span>
        </h1>
        <p className="hl d3">
          This path is not on any map in the keep. Perhaps a dragon ate it, or perhaps it was never written.
        </p>
        <div className="lost__cta hl d4">
          <Link className="btn solid" to="/">
            Return to the keep
          </Link>
          <Link className="btn" to="/" state={{ scrollTo: "work" }}>
            Browse the works
          </Link>
        </div>
      </div>
    </main>
  );
}
