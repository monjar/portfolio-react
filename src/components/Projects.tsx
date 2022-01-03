import React, { SyntheticEvent } from "react";
import Project from "../data/models/Project";
import "./Projects.css";
import IrregularGrid from "./utils/IrregularGrid";
import {
  SiUnity,
  SiCsharp,
  SiLua,
  SiGoland,
  SiSpringboot,
  SiJava,
  SiDocker,
} from "react-icons/si";
import { DiNodejs } from "react-icons/di";
const projectsData: Project[] = [
  {
    title: "Super Billiard",
    desc: 'Multiplayer Pool game on android platforms. An iranian replica of 8BallPool I worked on in "Cafe Bazaar".',
    link: "https://cafebazaar.ir/app/ir.cafebazistudio.eightball",
    image: "./images/billiard.png",
    stackIcons: [
      <SiUnity size={"2em"} />,
      <SiLua size={"2em"} />,
      <SiGoland size={"2em"} />,
      <SiCsharp size={"2em"} />,
    ],
  },
  {
    title: "Raidfield 2",
    desc: 'A MMO third-person shooter, Where players compete in a WW2 inspired enviornment and capture objectives. I worked on this game in "Alphatic inc".',
    link: "https://play.google.com/store/apps/details?id=com.alphatikinc.raidfield2&hl=en&gl=US",
    image: "./images/raidfield.webp",
    stackIcons: [<SiUnity size={"2em"} />, <SiCsharp size={"2em"} />],
  },
  {
    title: "Rahnema College",
    desc: 'The website for "Rahnema College", Which is an educational platform with different courses like Machine learning, Digital marketing, Data science, Programming and more. The website allows users to register, attend classes, watch videos and complete assignments in each course.',
    link: "https://rahnemacollege.com/",
    image: "./images/rahnema.jpeg",
    stackIcons: [
      <SiJava size={"2em"} />,
      <SiSpringboot size={"2em"} />,
      <DiNodejs size={"2em"} />,
      <SiDocker size={"2em"} />,
    ],
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
    <IrregularGrid>
      {projectsData.map((data: Project) => (
        <ProjectItem data={data} />
      ))}
    </IrregularGrid>
  );
};

export default Projects;
