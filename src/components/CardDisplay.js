import React from "react";
import "../styles/CardDisplay.css";

function CardDisplay({image, tooltip}) {
    return (
        <div className="skillItem">
            <div
                className="bgImage"
                style={{backgroundImage: `url(${image})`}}
                aria-label={tooltip}
            />
            <div className="tooltip">{tooltip}</div>
        </div>
    );
}

export default CardDisplay;