import { ReactNode } from "react";
import { works, Work } from "../data/content";

const CardInner = ({ w }: { w: Work }) => (
  <>
    <div className="wnum">{w.num}</div>
    <div className="craft">{w.craft}</div>
    <h3>{w.title}</h3>
    <p>{w.desc}</p>
    {w.video && (
      <div className="scry">
        <iframe
          src={w.video}
          title={w.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )}
    {w.stack && (
      <div className="stack">
        {w.stack.map((icon: ReactNode, i: number) => (
          <span key={i}>{icon}</span>
        ))}
      </div>
    )}
  </>
);

const Works = () => (
  <section className="sec" id="work">
    <div className="sec-head">
      <div className="eyebrow">Chapter II</div>
      <h2>
        The <span className="crimson">Works</span>
      </h2>
    </div>
    <div className="works">
      {works.map((w) =>
        w.link ? (
          <a
            key={w.title}
            className="work-card reveal"
            href={w.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CardInner w={w} />
          </a>
        ) : (
          <div key={w.title} className="work-card reveal">
            <CardInner w={w} />
          </div>
        )
      )}
    </div>
  </section>
);

export default Works;
