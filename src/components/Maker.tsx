import { makerParagraphs } from "../data/content";

const Maker = () => (
  <section className="sec band" id="about">
    <div className="sec-head">
      <div className="eyebrow">Chapter I</div>
      <h2>
        The <span className="crimson">Maker</span>
      </h2>
    </div>
    <div className="scroll-frame reveal">
      <div className="about-text">
        {makerParagraphs.map((p, i) => (
          <p key={i} className={i === 0 ? "dropcap" : undefined}>
            {p}
          </p>
        ))}
      </div>
    </div>
  </section>
);

export default Maker;
