import React, { useState, useEffect } from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import "../styles/AboutDisplay.css";

const API_URL = process.env.REACT_APP_API_URL;

function AboutDisplay() {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await fetch(`${API_URL}/about`);
                if (!response.ok) {
                    throw new Error('Failed to fetch about data');
                }
                const data = await response.json();
                if (!Array.isArray(data)) {
                    setAboutData(data);
                } else if (data.length > 0) {
                    setAboutData(data[0]);
                } else {
                    throw new Error('Invalid response format');
                }
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    if (loading) {
        return <div className="main"><div className="about"><h2>Loading...</h2></div></div>;
    }

    if (error) {
        return <div className="main"><div className="about"><h2>Error: {error}</h2></div></div>;
    }

    return (
        <TransitionGroup component={null}>
            <CSSTransition timeout={500} classNames="page" unmountOnExit>
                <div className="main">
                    <div className="about">
                        {aboutData?.image && <img src={aboutData.image} alt="Profile"/>}
                        <div className="about-text">
                            <h1>
                                {aboutData?.title}
                            </h1>
                            <h5>
                                {aboutData?.engines} <span>{aboutData?.jobTitle}</span>
                            </h5>
                            {aboutData?.description?.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
}

export default AboutDisplay;