import React from "react";
import AboutMe from "../components/AboutMe";
import Header from "../components/Header";
import "./MainPage.css";
import { DiJava } from "react-icons/di";

import {
  SiCplusplus,
  SiDocker,
  SiJavascript,
  SiPython,
  SiUnity,
  SiUnrealengine,
  SiVisualstudiocode,
} from "react-icons/si";
import { FaCodeBranch, FaGamepad } from "react-icons/fa";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Education from "../components/Education";
import Gallery from "../components/Gallery";
const MainPage = () => {
  const [nav, setNav] = React.useState("about-me");
  const handleNaveChange = (selectedNav: string) => {
    setNav(selectedNav);
  };

  return (
    <>
      <div className="area">
        <ul className="circles">
          <li>
            <FaCodeBranch color="rgba(255, 255, 255, 0.158)" size={"100%"} />
          </li>
          <li>
            <SiVisualstudiocode
              color="rgba(255, 255, 255, 0.158)"
              size={"100%"}
            />
          </li>
          <li>
            <SiCplusplus color="rgba(255, 255, 255, 0.158)" size={"100%"} />
          </li>
          <li>
            <SiJavascript color="rgba(255, 255, 255, 0.158)" size={"100%"} />
          </li>
          <li>
            <DiJava color="rgba(255, 255, 255, 0.158)" size={"100%"} />
          </li>
          <li>
            <SiUnity color="rgba(255, 255, 255, 0.158)" size={"100%"} />
          </li>
          <li>
            <SiDocker color="rgba(255, 255, 255, 0.158)" size={"100%"} />
          </li>
          <li>
            <FaGamepad color="rgba(255, 255, 255, 0.158)" size={"100%"} />
          </li>
          <li>
            <SiUnrealengine color="rgba(255, 255, 255, 0.158)" size={"100%"} />
          </li>
          <li>
            <SiPython color="rgba(255, 255, 255, 0.158)" size={"100%"} />
          </li>
        </ul>
      </div>
      <div className="main-container">
        <Header selectedNav={nav} handleNaveChange={handleNaveChange} />
        <AboutMe />
        <Gallery/>
        <Experience />

        <Education />

        <Projects />
      </div>
    </>
  );
};

export default MainPage;
