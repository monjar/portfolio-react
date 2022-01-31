import React, { SyntheticEvent } from "react";
import "./Experience.css";
import NavButton from "./utils/NavButton";
import { BiCodeAlt } from "react-icons/bi";
import { MdWork } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { scroller } from "react-scroll";
import { IoMdSchool } from "react-icons/io";
import ExperienceItem from "../data/models/ExperienceItem";
import { experienceData } from "../data/repository";
const expData: ExperienceItem[] = experienceData.reverse();
const Experience = (props: any) => {
  return (
    <>
      <div className="Experience-section-title">Experiences</div>
      <div className="exp-container">
        {expData.map((experience, index) => (
          <div
            className={
              "exp-timeline-block exp-timeline-block-" +
              (index % 2 == 0 ? "right" : "left")
            }
          >
            <a
              href={experience.link}
              className="exp-marker-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={experience.image} className="exp-marker" />
            </a>
            <div className="exp-timeline-content">
              <h3>{experience.date}</h3>
              <span>{experience.title}</span>
              <p>{experience.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Experience;
