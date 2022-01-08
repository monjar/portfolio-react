import React, { SyntheticEvent } from "react";
import "./Header.css";
import NavButton from "./utils/NavButton";
import { BiCodeAlt } from "react-icons/bi";
import { MdWork } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { scroller, animateScroll } from "react-scroll";
import { useScrollDirection } from "react-use-scroll-direction";

import { IoMdSchool } from "react-icons/io";
const Header = (props: any) => {
  const scrollToSection = (sectionName: string) => {
    if (sectionName === "Aboutme") animateScroll.scrollToTop();
    else
      scroller.scrollTo(sectionName + "-section-title", {
        delay: 0,
        smooth: "easeInOutQuart",
      });
  };
  const handleNavChange = (newValue: string) => {
    props.handleNaveChange(newValue);
    scrollToSection(newValue);
  };
  const [direction, setDirection] = React.useState(String);
  const { isScrollingUp, isScrollingDown } = useScrollDirection();

  React.useEffect(() => {
    isScrollingDown && setDirection("down");
    isScrollingUp && setDirection("up");
  }, [isScrollingDown, isScrollingUp]);

  return (
    <div className={"header-bg " + (direction === "down" ? "hide-header" : "")}>
      <NavButton
        title="About me"
        icon={<CgProfile size={"2em"} />}
        onClick={handleNavChange}
      />
      <NavButton
        title="Experience"
        icon={<MdWork size={"2em"} />}
        onClick={handleNavChange}
      />
      <NavButton
        title="Education"
        icon={<IoMdSchool size={"2em"} />}
        onClick={handleNavChange}
      />

      <NavButton
        title="Projects"
        icon={<BiCodeAlt size={"2em"} />}
        onClick={handleNavChange}
      />
    </div>
  );
};

export default Header;
