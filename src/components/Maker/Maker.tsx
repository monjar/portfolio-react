import { makerParagraphs } from "../../data/content";
import GildedFrame from "../../effects/GildedFrame/GildedFrame";
import SectionHead from "../SectionHead/SectionHead";
import "./Maker.css";

const Maker = () => (
  <section className="sec band" id="about">
    <SectionHead chapter="Chapter I" lead="The" crimson="Maker" />
    <GildedFrame className="scroll-frame">
      <div className="about-text">
        {makerParagraphs.map((p, i) => (
          <p key={i} className={`reveal ${i === 0 ? "dropcap" : ""}`}>
            {p}
          </p>
        ))}
      </div>
    </GildedFrame>
  </section>
);

export default Maker;
