import React from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import VideoPlayer from "../components/VideoPlayer";
import { ProjectList } from "../helpers/ProjectList";
import "../styles/ProjectDisplay.css";

function ProjectDisplay() {
  const { id } = useParams();
  const project = ProjectList[id];

  return (
    <div className="project">
      <h1>{project.name}</h1>
      <div className="split-content">
        <div className="left-content">
          <h2>Project Description:</h2>
          {project.descriptions.map((item, index) => (
            <p key={index} className="item">
              {item}
            </p>
          ))}
          <h2>Responsibilities:</h2>
          {project.responsabilities.map((item, index) => (
            <p key={index} className="item">
              {item}
            </p>
          ))}
          {project.link && (
            <div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="button"
              >
                Go to the Website
              </a>
            </div>
          )}
        </div>
        {project.images && project.images.length > 0 && (
          <div className="right-content">
            <ImageSlider cards={project.images} />
          </div>
        )}
      </div>

      <div className="content">
        {project.videoUrl && (
          <div className="video-container">
            <div className="centered-video">
              <VideoPlayer url={project.videoUrl} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDisplay;
