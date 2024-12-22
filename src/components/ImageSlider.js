import React, { useState, useEffect } from "react";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import "../styles/ImageSlider.css";

const ImageSlider = ({ cards }) => {
  const [current, setCurrent] = useState(0);
  const length = cards.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds (adjust as needed)

    return () => clearTimeout(timer);
  }, [current]);

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(cards) || length <= 0) {
    return null;
  }

  return (
    <section className="image-slider">
      <FaArrowAltCircleLeft className="left-arrow" onClick={prevSlide} />
      <FaArrowAltCircleRight className="right-arrow" onClick={nextSlide} />
      {cards.map((card, index) => (
        <div
          className={
            index === current
              ? "card active"
              : index < current
              ? "card left"
              : "card right"
          }
          key={index}
        >
          {index === current && (
            <img
              src={card.image}
              alt={card.alt}
              type="image/webp"
              className="image"
              loading="lazy"
              decoding="async"
              fetchpriority="high"
            />
          )}
        </div>
      ))}
    </section>
  );
};

export default ImageSlider;
