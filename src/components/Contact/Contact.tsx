import { cv, socials } from "../../data/content";
import InkText from "../../effects/InkText/InkText";
import { ScrollGlyph } from "../icons";
import "./Contact.css";

const Contact = () => (
  <section className="contact band" id="contact">
    <div className="wrap">
      <div className="eyebrow sole reveal" style={{ marginBottom: 22 }}>
        Chapter VI · Contact
      </div>
      <InkText as="h2" parts={["Send a ", { text: "raven", className: "crimson" }]} />
      <p className="hero-lede reveal">Have a realm to build or a machine to raise? The workshop door is open.</p>
      <div className="socials reveal">
        {socials.map((s) => (
          <a key={s.label} href={s.href} target={s.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer">
            {s.label}
          </a>
        ))}
        <a href={cv} target="_blank" rel="noopener noreferrer" className="socials__cv">
          <ScrollGlyph /> The Scroll of Deeds (CV)
        </a>
      </div>
    </div>
  </section>
);

export default Contact;
