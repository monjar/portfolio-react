import React, { SyntheticEvent } from "react";
import "./IrregularGrid.css";
const IrregularGrid = (props: any) => {
  const { children } = props;
  return (
    <div className="irreg-grid-container">
      {children.map((child: React.ReactChild) => (
        <div className="irreg-grid-item">{child}</div>
      ))}
    </div>
  );
};

export default IrregularGrid;
