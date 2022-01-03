import React, { SyntheticEvent } from "react";
import Project from "../data/models/Project";
import "./Projects.css";
import IrregularGrid from "./utils/IrregularGrid";
const projectsData: Project[] = [
  {
    title: "Raidfield 2",
    desc: "this is the first project this is the first project this is the first project this is the first project this is the first project this is the first projectthis is the first project this is the first project this is the first project",
    link: "https://play.google.com/store/apps/details?id=com.alphatikinc.raidfield2&hl=en&gl=US",
    image: "./images/raidfield.webp",
  },
  {
    title: "Super Billiard",
    desc: "this is the first pro the  o the first pr othe fi o the first pr othe fi first pr othe first project this is the first project this is the first project this is the first project this is the first project this is the first projectthis is the first project this is the first project this is the first project",
    link: "https://cafebazaar.ir/app/ir.cafebazistudio.eightball",
    image: "./images/billiard.png",
  },
  {
    title: "Rahnema College",
    desc: "this is the first pro the  o the first pr othe fi o the first pr othe fi first pr othe first project this is the first project this is the first project this is the first project this is the first project this is the first projectthis is the first project this is the first project this is the first project",
    link: "https://rahnemacollege.com/",
    image: "./images/rahnema.jpeg",
  },
];
const ProjectItem = (props: any) => {
  const data: Project = props.data;
  return (
    <a className="project-item">
      <div className="project-item-title">{data.title}</div>
      <a href={data.link}>
        <img src={data.image} />
      </a>
      <div className="project-item-desc">{data.desc}</div>
      <div className="project-item-date">{data.date}</div>
    </a>
  );
};
const Projects = (props: any) => {
  return (
    <IrregularGrid>
      {projectsData.map((data: Project) => (
        <ProjectItem data={data} />
      ))}
    </IrregularGrid>
  );
};

export default Projects;
