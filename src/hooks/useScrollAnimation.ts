import { useEffect, useRef, useState, RefObject } from 'react';

/**
 * useScrollAnimation Hook Return Type
 */
type UseScrollAnimationReturn = [RefObject<HTMLElement | null>, boolean];

/**
 * useScrollAnimation Hook
 *
 * Uses Intersection Observer to detect when an element enters the viewport
 * Returns a ref to attach to the element and a boolean indicating visibility
 *
 * @param threshold - Percentage of element visibility to trigger (default: 0.2)
 * @returns Tuple of [ref, isVisible]
 */
const useScrollAnimation = (threshold: number = 0.2): UseScrollAnimationReturn => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold,
        rootMargin: '0px'
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};

export default useScrollAnimation;
