import { useEffect, useState } from 'react';

/**
 * Mouse Position Interface
 */
interface MousePosition {
  x: number;
  y: number;
}

/**
 * useMousePosition Hook
 *
 * Tracks the current mouse position on the screen
 * Updates position on every mouse move event
 */
const useMousePosition = (): MousePosition => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent): void => {
      setPosition({
        x: event.clientX,
        y: event.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return position;
};

export default useMousePosition;
