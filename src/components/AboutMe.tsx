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
import { SiGmail, SiMedium, SiSoundcloud } from "react-icons/si";
import { aboutMeData } from "../data/repository";
const AboutMe = (props: any) => {
  return (
    <div className="about-me-bg">
      <div className="about-me-wellcome">
        <h1 className="hello-there">{aboutMeData.heading}</h1>
        <h3 className="intro">{aboutMeData.subHeading}</h3>
      </div>
      {aboutMeData.intro.map(intro=>(
        <div className="about-me-wellcome general-desc">{intro}</div>
      ))}
      
      <div className="social-container">
        {aboutMeData.social.telegram && (
          <a
            href={aboutMeData.social.telegram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegramPlane size={"3.5em"} className="social-item" />
          </a>
        )}
        {aboutMeData.social.github && (
          <a
            href={aboutMeData.social.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillGithub size={"3.5em"} className="social-item" />
          </a>
        )}
        {aboutMeData.social.linkedin && (
          <a
            href={aboutMeData.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillLinkedin size={"3.5em"} className="social-item" />
          </a>
        )}
        {aboutMeData.social.instagram && (
          <a
            href={aboutMeData.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiOutlineInstagram size={"3.5em"} className="social-item" />
          </a>
        )}
        {aboutMeData.social.twitter && (
          <a
            href={aboutMeData.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiOutlineTwitter size={"3.5em"} className="social-item" />
          </a>
        )}
        {aboutMeData.social.soundCloud && (
          <a
            href={aboutMeData.social.soundCloud}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiSoundcloud size={"3.5em"} className="social-item" />
          </a>
        )}
        {aboutMeData.social.gmail && (
          <a
            href={aboutMeData.social.gmail}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGmail size={"3.5em"} className="social-item" />
          </a>
        )}
        {aboutMeData.social.medium && (
          <a
            href={aboutMeData.social.medium}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiMedium size={"3.5em"} className="social-item" />
          </a>
        )}
      </div>
      <div className="downloadable-container">
        <a
          href={process.env.PUBLIC_URL + "/pdfs/GameDev_CV.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="downloadable-item"
        >
          <AiOutlineDownload
            size={"1.2em"}
            className="downloadable-item-icon"
          />
          <div className="downloadable-item-text">Download CV</div>
        </a>
        
      </div>
    </div>
  );
};

export default AboutMe;
