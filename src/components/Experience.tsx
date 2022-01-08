import React, { SyntheticEvent } from "react";
import "./Experience.css";
import NavButton from "./utils/NavButton";
import { BiCodeAlt } from "react-icons/bi";
import { MdWork } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { scroller } from "react-scroll";
import { IoMdSchool } from "react-icons/io";
import ExperienceItem from "../data/models/ExperienceItem";
const expData: ExperienceItem[] = [
  {
    date: "2019",
    title: "Backend Development Intern",
    desc: 'The website for "Rahnema College", Which is an educational platform with different courses like Machine learning, Digital marketing, Data science, Programming and more. The website allows users to register, attend classes, watch videos and complete assignments in each course.',
    link: "https://rahnemacollege.com/",
    image: "./images/rahnema.jpeg",
  },
  {
    date: "2020",
    title: "Junior Game Developer",
    desc: 'The website for "Rahnema College", Which is an educational platform with different courses like Machine learning, Digital marketing, Data science, Programming and more. The website allows users to register, attend classes, watch videos and complete assignments in each course.',
    link: "https://alphatik.com/index.html",
    image: "./images/alphatik.jpeg",
  },
];
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
