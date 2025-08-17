import { useState, useEffect, useRef, RefObject } from 'react';

interface UseScrollAnimationReturn {
  ref: RefObject<HTMLElement | null>;
  isVisible: boolean;
}

export const useScrollAnimation = (threshold: number = 0.1): UseScrollAnimationReturn => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we can disconnect the observer
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: '50px 0px -50px 0px'
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

  return { ref, isVisible };
};

export default useScrollAnimation;