import { useRef } from "react";
import { m, useScroll, useSpring } from "motion/react";
import { chronicle } from "../../data/content";
import SectionHead from "../SectionHead/SectionHead";
import "./Chronicle.css";

const Chronicle = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section className="sec band" id="chronicle">
      <SectionHead chapter="Chapter IV" lead="The" crimson="Chronicle" />
      <div className="chronicle" ref={ref}>
        <m.span className="chronicle__fill" style={{ scaleY: fill }} aria-hidden="true" />
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
};

export default Chronicle;
