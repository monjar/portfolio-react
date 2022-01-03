import React, { SyntheticEvent } from "react";
import "./Header.css";
import NavButton from "./utils/NavButton";
import { BiCodeAlt } from "react-icons/bi";
import { MdWork } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoMdSchool } from "react-icons/io";
const Header = (props: any) => {
  const handleNavChange = (newValue: string) => {
    props.handleNaveChange(newValue);
  };

  return (
    <div className="header-bg">
      <NavButton
        title="About me"
        icon={<CgProfile size={"2em"} />}
        onClick={handleNavChange}
      />
      <NavButton
        title="Projects"
        icon={<BiCodeAlt size={"2em"} />}
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
    </div>
  );
};

export default Header;
