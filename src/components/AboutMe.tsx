import React, { SyntheticEvent } from "react";
import "./AboutMe.css";

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
    </div>
  );
};

export default AboutMe;
