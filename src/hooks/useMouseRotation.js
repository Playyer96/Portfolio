import { useState, useCallback } from 'react';

const useMouseRotation = (containerRef) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(e => {
    if (!containerRef?.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientY - centerY) / (rect.height / 2);
    const y = (e.clientX - centerX) / (rect.width / 2);

    setRotation({
      x: Math.max(-16, Math.min(16, x * 16)),
      y: Math.max(-16, Math.min(16, y * 16)),
    });
  }, [containerRef]);

  const handleMouseLeave = useCallback(() => {
    setRotation({ x: 0, y: 0 });
  }, []);

  const style = {
    perspective: '1600px',
    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    transition: 'transform 0.2s ease-out',
    transformStyle: 'preserve-3d',
  };

  return {
    style,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
    rotation,
  };
};

export default useMouseRotation;
