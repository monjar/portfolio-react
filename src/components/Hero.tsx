import { useNavigate } from "react-router-dom";
import { Dragon } from "./icons";
import { hero } from "../data/content";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-sky" />
      <div className="dragons">
        <Dragon variant="d1" />
        <Dragon variant="d2" />
        <Dragon variant="d3" />
      </div>

      <div className="wrap hero-inner">
        <div className="eyebrow hl d1">{hero.eyebrow}</div>
        <h1 className="hl d2">
          <span className="small">{hero.small}</span>
          {hero.firstName} <span className="crimson">{hero.lastName}</span>
        </h1>
        <p className="hero-lede hl d3">
          Artificer of <strong>games</strong> and summoner of{" "}
          <strong>bugs</strong>, a software engineer who bends <em>C++</em>,{" "}
          <em>C#</em> and <em>Unity</em> to make worlds that breathe and play
          that feels alive.
        </p>
        <div className="hero-cta hl d4">
          <button
            className="btn solid"
            onClick={() =>
              document
                .getElementById("work")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Behold the works
          </button>
          <button className="btn" onClick={() => navigate("/blog")}>
            Open the codex
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
