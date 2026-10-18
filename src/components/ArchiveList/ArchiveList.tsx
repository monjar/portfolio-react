import { archive } from "../../data/projects";
import StackChips from "../StackChips/StackChips";
import { ExternalGlyph } from "../icons";
import "./ArchiveList.css";

/* The ledger: smaller quests, side projects and experiments, one line each. */
const ArchiveList = () => (
  <div className="archive">
    <h3 className="works-group__title reveal">
      <span>From the Archive</span> · side quests
    </h3>
    <ul className="archive__list">
      {archive.map((p) => (
        <li key={p.slug} className="reveal">
          <a href={p.links.repo} target="_blank" rel="noopener noreferrer" className="archive__row">
            <span className="archive__title">{p.title}</span>
            <span className="archive__tag">{p.tagline}</span>
            <StackChips stack={p.stack} compact max={3} />
            <ExternalGlyph />
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default ArchiveList;
