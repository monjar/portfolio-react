import { chronicle } from "../data/content";

const Chronicle = () => (
  <section className="sec band" id="chronicle">
    <div className="sec-head">
      <div className="eyebrow">Chapter III</div>
      <h2>
        The <span className="crimson">Chronicle</span>
      </h2>
    </div>
    <div className="chronicle">
      {chronicle.map((c, i) => (
        <div className="chron-row reveal" key={i}>
          <div className="when">{c.when}</div>
          <div className="what">
            <h4>
              {c.title} <span>{c.place}</span>
            </h4>
            <p>{c.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Chronicle;
