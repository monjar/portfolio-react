import React, { SyntheticEvent } from "react";
import PersonIcon from "@mui/icons-material/Person";
import CodeIcon from "@mui/icons-material/Code";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import "./Header.css";
import NavButton from "./utils/NavButton";

const Header = (props: any) => {
  const handleNavChange = (newValue: string) => {
    props.handleNaveChange(newValue);
  };

  return (
    <div className="header-bg">
      <NavButton
        title="About me"
        icon={<PersonIcon />}
        onClick={handleNavChange}
      />
      <NavButton
        title="Projects"
        icon={<CodeIcon />}
        onClick={handleNavChange}
      />
      <NavButton
        title="Experience"
        icon={<WorkIcon />}
        onClick={handleNavChange}
      />
      <NavButton
        title="Education"
        icon={<SchoolIcon />}
        onClick={handleNavChange}
      />
    </div>
  );
};

export default Header;
