import React from "react";
import Header from "../components/Header";
import "./MainPage.css";

const MainPage = () => {
  const [nav, setNav] = React.useState("about-me");
  const handleNaveChange = (selectedNav: string) => {
    setNav(selectedNav);
    console.log("Selected Nav: " + selectedNav);
  };
  return (
    <div>
      <Header selectedNav={nav} handleNaveChange={handleNaveChange} />
    </div>
  );
};

export default MainPage;
