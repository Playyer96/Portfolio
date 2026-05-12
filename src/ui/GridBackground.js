import { useState, useEffect } from 'react';
import './GridBackground.css';

const GridBackground = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = e => {
      const x = (e.clientX / window.innerWidth) * 16 - 8;
      const y = (e.clientY / window.innerHeight) * 16 - 8;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="grid-background"
      style={{
        backgroundPosition: `${offset.x}px ${offset.y}px`,
      }}
    />
  );
};

export default GridBackground;
