import React, { SyntheticEvent } from "react";
import "./AboutMe.css";
import {
  AiFillGithub,
  AiFillLinkedin,
  AiOutlineInstagram,
  AiOutlineTwitter,
} from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
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
          href="https://twitter.com/amiralimnj"
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
      </div>
    </div>
  );
};

export default AboutMe;
