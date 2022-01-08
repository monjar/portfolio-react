import React, { SyntheticEvent } from "react";
import "./Utils.css";
const NavButton = (props: any) => {
  const { onClick, icon, title } = props;
  return (
    <div className="nav-button" onClick={() => onClick(title.trim())}>
      <div className="icon-container">{icon}</div>
      <div>{title}</div>
    </div>
  );
};

export default NavButton;
