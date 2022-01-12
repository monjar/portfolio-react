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
    desc: "Worked on a Farsi replica of E-Bay, Developed backend using Java Spring and frontend using React and React Native",
    link: "https://rahnemacollege.com/",
    image: "./images/rahnema.jpeg",
  },
  {
    date: "2021",
    title: "Junior Game Developer",
    desc: `Worked on a low-poly MMO shooter game, Developed Gameplay mechanics using Unity, Real-time multiplayer system using
    PhotonEngine, In-app purchase and Ad systems using Google services and Steam. And, Released the game on Steam, AppleStore
    and GooglePlay`,
    link: "https://alphatik.com/index.html",
    image: "./images/alphatik.jpeg",
  },
  {
    date: "2021",
    title: "Junior Game Developer",
    desc: `Worked on a Farsi Replica of 8Ball-Pool game, Developed Gameplay mechanics and 8Ball physics using Unity. Developed real-time
    multiplayer system using Nakama server, A custom in-app purchase system and Ad-reward videos for Iranian users`,
    link: "https://cafebazaar.ir/install?l=en",
    image: "./images/cafe.jpeg",
  },
  {
    date: "2021 - Present",
    title: "Backend Development Intern",
    desc: `Working on rahnemacollege.com. Which is an educational websites with courses and videos for Farsi speaking learners (Like
        Coursera or Udemy)`,
    link: "https://rahnemacollege.com/",
    image: "./images/rahnema.jpeg",
  },
].reverse();
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
