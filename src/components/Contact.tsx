import { socials } from "../data/content";

const Contact = () => (
  <section className="contact band" id="contact">
    <div className="wrap">
      <div className="eyebrow sole reveal" style={{ marginBottom: 22 }}>
        Chapter V · Contact
      </div>
      <h2 className="reveal">
        Send a <span className="crimson">raven</span>
      </h2>
      <p className="hero-lede reveal">
        Have a realm to build or a machine to raise? The workshop door is open.
      </p>
      <div className="socials reveal">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default Contact;
