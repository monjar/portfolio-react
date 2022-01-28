import React, { SyntheticEvent } from "react";
import "./AboutMe.css";
import {
  AiFillGithub,
  AiFillLinkedin,
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineDownload,
} from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import { SiGmail, SiSoundcloud } from "react-icons/si";
const AboutMe = (props: any) => {
  return (
    <div className="about-me-bg">
      <div className="about-me-wellcome">
        <h1 className="hello-there">Hello There!</h1>
        <h3 className="intro">I'm Amirali Monjar</h3>
      </div>
      <div className="about-me-wellcome general-desc">
        A Game Developer In Love With Programming, AI, And Algorithms.
      </div>
      <div className="social-container">
        <a
          href="https://t.me/AmiraliMonjar"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTelegramPlane size={"3.5em"} className="social-item" />
        </a>
        <a
          href="https://github.com/monjar"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiFillGithub size={"3.5em"} className="social-item" />
        </a>
        <a
          href="https://www.linkedin.com/in/monjar/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiFillLinkedin size={"3.5em"} className="social-item" />
        </a>
        <a
          href="https://www.instagram.com/amirali.mnj/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiOutlineInstagram size={"3.5em"} className="social-item" />
        </a>
        <a
          href="https://twitter.com/amiralimnj"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiOutlineTwitter size={"3.5em"} className="social-item" />
        </a>
        <a
          href="https://soundcloud.com/monjar"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiSoundcloud size={"3.5em"} className="social-item" />
        </a>
        <a
          href="mailto:amirali.mnj@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGmail size={"3.5em"} className="social-item" />
        </a>
      </div>
      <div className="downloadable-container">
        <a
          href={process.env.PUBLIC_URL + "/pdfs/CV.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="downloadable-item"
        >
          <AiOutlineDownload
            size={"1.2em"}
            className="downloadable-item-icon"
          />
          <div className="downloadable-item-text">CV</div>
        </a>
        <a
          className="downloadable-item "
          href={process.env.PUBLIC_URL + "/pdfs/Resume.pdf"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiOutlineDownload
            size={"1.2em"}
            className="downloadable-item-icon"
          />
          <div className="downloadable-item-text">Resume</div>
        </a>
      </div>
    </div>
  );
};

export default AboutMe;
