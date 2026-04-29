import { useEffect, useState } from 'react';

/**
 * useParallax Hook
 *
 * Creates a parallax scrolling effect by tracking scroll position
 * Returns an offset value based on scroll position and speed multiplier
 *
 * @param speed - Parallax speed multiplier (default: 0.5)
 * @returns Calculated offset value for parallax effect
 */
const useParallax = (speed: number = 0.5): number => {
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const handleScroll = (): void => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return offset;
};

export default useParallax;
