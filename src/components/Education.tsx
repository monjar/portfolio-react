import React, { SyntheticEvent } from "react";
import Project from "../data/models/Project";
import "./Education.css";
import IrregularGrid from "./utils/IrregularGrid";
import {
  SiUnity,
  SiCsharp,
  SiLua,
  SiGoland,
  SiSpringboot,
  SiJava,
  SiDocker,
  SiTensorflow,
  SiQt,
  SiCplusplus,
  SiNumpy,
  SiKeras,
  SiOpencv,
} from "react-icons/si";
import { DiNodejs, DiPython } from "react-icons/di";
import EducationItem from "../data/models/EducationItem";
import { educationData } from "../data/repository";
const eduData: EducationItem[] = educationData;

const EducationComponentItem = (props: any) => {
  const data: EducationItem = props.data;
  return (
    <div className="edu-item">
      <div>
        <div className="edu-item-title">{data.title}</div>
        <div className="edu-item-desc">{data.place}</div>
        <div className="edu-item-date">{data.date}</div>
      </div>
      <a href={data.link} target="_blank" rel="noopener noreferrer">
        <img src={data.image} className="edu-item-image" />
      </a>
    </div>
  );
};
const Education = (props: any) => {
  return (
    <>
      <div className="Education-section-title">Education</div>
      <div className="edu-container">
        {eduData.map((data: EducationItem) => (
          <EducationComponentItem data={data} />
        ))}
      </div>
    </>
  );
};

export default Education;
