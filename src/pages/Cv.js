import React from "react";
import MyCv from "../assets/cv/CV-Danilo-Vanegas-2025.pdf";
import "../styles/Cv.css";

const Cv = () => (
  <iframe className="cv-container" title="My CV" src={MyCv} type="application/pdf" />
);

export default Cv;