import { Link } from "react-router";
import ArcaneSky from "../../effects/ArcaneSky/ArcaneSky";
import ParallaxDragons from "../../effects/ParallaxDragons/ParallaxDragons";
import InkText from "../../effects/InkText/InkText";
import { cv, hero } from "../../data/content";
import { ScrollGlyph } from "../icons";
import "./Hero.css";

const Hero = () => (
  <section className="hero">
    <ArcaneSky />
    <ParallaxDragons />

    <div className="wrap hero-inner">
      <div className="eyebrow hl d1">{hero.eyebrow}</div>
      <h1 className="hero-title">
        <span className="small hl d1">{hero.small}</span>
        <InkText
          className="hero-name"
          parts={[hero.firstName + " ", { text: hero.lastName, className: "crimson" }]}
          immediate
          delay={350}
          stagger={70}
        />
      </h1>
      <svg className="hero-flourish" viewBox="0 0 600 40" aria-hidden="true">
        <path d="M10 22 C 120 4, 200 36, 300 20 S 480 4, 590 20" pathLength={1} />
        <path d="M282 20 l18 -12 l18 12 l-18 12 z" pathLength={1} />
      </svg>
      <p className="hero-lede hl d3">{hero.lede}</p>
      <div className="hero-cta hl d4">
        <button className="btn solid" onClick={() => document.getElementById("relics")?.scrollIntoView({ behavior: "smooth" })}>
          Behold the works
        </button>
        <Link className="btn" to="/blog">
          Open the codex
        </Link>
        <a className="btn ghost" href={cv} target="_blank" rel="noopener noreferrer">
          <ScrollGlyph /> Unroll my CV
        </a>
      </div>
      <Link to="/works/mochiro" className="hero-forging hl d5">
        <span className="hero-forging__dot" aria-hidden="true" />
        <span>Now forging:</span> <strong>Mochiro</strong>
        <span className="hero-forging__more">, a familiar with a face</span>
      </Link>
    </div>

    <button
      className="hero-scroll"
      aria-label="Scroll to the Maker"
      onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
    >
      <span />
    </button>
  </section>
);

export default Hero;
