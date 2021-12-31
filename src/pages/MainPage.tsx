import React from "react";
import AboutMe from "../components/AboutMe";
import Header from "../components/Header";
import "./MainPage.css";

const MainPage = () => {
  const [nav, setNav] = React.useState("about-me");
  const handleNaveChange = (selectedNav: string) => {
    setNav(selectedNav);
  };
  return (
    <>
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div>
        <Header selectedNav={nav} handleNaveChange={handleNaveChange} />
        <AboutMe />
      </div>
    </>
  );
};

export default MainPage;
