import React, { SyntheticEvent } from "react";
import Project from "../data/models/Project";
import "./Projects.css";
import IrregularGrid from "./utils/IrregularGrid";

import { projectsData } from "../data/repository";

const ProjectItem = (props: any) => {
  const data: Project = props.data;
  return (
    <a className="project-item">
      <div className="project-item-title">{data.title}</div>
      <a href={data.link} target="_blank" rel="noopener noreferrer">
        <img src={data.image} />
      </a>
      <div className="project-item-desc">{data.desc}</div>
      <div className="project-item-date">{data.date}</div>
      <div className="project-item-stack">
        {data.stackIcons?.map((icon) => (
          <div className="project-item-stackitem">{icon}</div>
        ))}
      </div>
    </a>
  );
};
const Projects = (props: any) => {
  return (
    <>
      <div className="Projects-section-title">Projects</div>
      <IrregularGrid>
        {projectsData.map((data: Project) => (
          <ProjectItem data={data} />
        ))}
      </IrregularGrid>
    </>
  );
};

export default Projects;
