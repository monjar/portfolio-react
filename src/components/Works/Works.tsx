import { newWorks, elderWorks, relics } from "../../data/projects";
import { roman } from "../../lib/roman";
import SectionHead from "../SectionHead/SectionHead";
import ProjectCard from "../ProjectCard/ProjectCard";
import ArchiveList from "../ArchiveList/ArchiveList";
import "./Works.css";

const Works = () => {
  let n = relics.length;
  return (
    <section className="sec" id="work">
      <SectionHead chapter="Chapter III" lead="The" crimson="Works" sub="Newer quests first, then the elder works from studios, studies and jams." />

      <div className="works-group">
        <h3 className="works-group__title reveal">
          <span>New Works</span> · MMXXVI
        </h3>
        <div className="works">
          {newWorks.map((p) => (
            <ProjectCard key={p.slug} p={p} num={roman(++n)} />
          ))}
        </div>
      </div>

      <div className="works-group">
        <h3 className="works-group__title reveal">
          <span>Elder Works</span> · MMXX – MMXXIV
        </h3>
        <div className="works works--elder">
          {elderWorks.map((p) => (
            <ProjectCard key={p.slug} p={p} num={roman(++n)} />
          ))}
        </div>
      </div>

      <ArchiveList />
    </section>
  );
};

export default Works;
