import React from "react";
import "../styles/CardDisplay.css";

function CardDisplay({ icon: Icon, tooltip }) {
    return (
        <div className="skillItem">
            <div className="icon-container">
                <Icon className="tech-icon" />
            </div>
            <div className="tooltip">{tooltip}</div>
        </div>
    );
}

export default CardDisplay;