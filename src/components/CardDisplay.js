import React from "react";
import "../styles/CardDisplay.css";

function CardDisplay({ image, tooltip }) {
  return (
    <div className="skillItem">
      <div
        style={{ backgroundImage: `url(${image})` }}
        className="bgImage"
        loading="lazy"
      />
      {/* <img src={image} className="bgImage" alt="" /> */}
      <tool-tip role="tooltip">{tooltip}</tool-tip>
    </div>
  );
}

export default CardDisplay;
