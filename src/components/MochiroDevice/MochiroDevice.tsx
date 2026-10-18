/* Mochiro's live face in a little graphite device. Hover: curious. Click: happy
   (and a heart, if you keep at it). The face code is a lazy chunk. */
import { lazy, Suspense, useState } from "react";
import { useCapabilities } from "../../lib/capabilities";
import "./MochiroDevice.css";

const MochiroFace = lazy(() =>
  import("../../vendor/mochiro-face/MochiroFace").then((m) => ({ default: m.MochiroFace }))
);

export default function MochiroDevice({ className = "" }: { className?: string }) {
  const [mood, setMood] = useState<"neutral" | "curious" | "happy" | "love">("neutral");
  const [pets, setPets] = useState(0);
  const { reduced } = useCapabilities();

  const pet = () => {
    const n = pets + 1;
    setPets(n);
    setMood(n % 4 === 0 ? "love" : "happy");
    window.setTimeout(() => setMood("neutral"), 2600);
  };

  return (
    <button
      type="button"
      className={`mochiro-device ${className}`}
      onPointerEnter={() => mood === "neutral" && setMood("curious")}
      onPointerLeave={() => mood === "curious" && setMood("neutral")}
      onClick={pet}
      aria-label="Mochiro's face. Click to pet it."
    >
      <span className="mochiro-device__screen">
        <Suspense fallback={<span className="mochiro-device__fallback" />}>
          <MochiroFace emotion={mood} color="#00e5de" bloom={reduced ? 0.3 : 0.7} autoBlink={!reduced} />
        </Suspense>
      </span>
      <span className="mochiro-device__hint" aria-hidden="true">
        {pets ? `petted ×${pets}` : "pet me"}
      </span>
    </button>
  );
}
