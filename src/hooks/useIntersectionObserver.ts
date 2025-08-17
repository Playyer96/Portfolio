import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

interface UseIntersectionObserverReturn {
  elementRef: RefObject<HTMLElement | null>;
  isIntersecting: boolean;
  hasIntersected: boolean;
}

interface UseScrollAnimationReturn {
  elementRef: RefObject<HTMLElement | null>;
  shouldAnimate: boolean;
  hasIntersected: boolean;
}

export const useIntersectionObserver = (options: UseIntersectionObserverOptions = {}): UseIntersectionObserverReturn => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const [hasIntersected, setHasIntersected] = useState<boolean>(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options]);

  return { elementRef, isIntersecting, hasIntersected };
};

export const useScrollAnimation = (delay: number = 0): UseScrollAnimationReturn => {
  const { elementRef, hasIntersected } = useIntersectionObserver();
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  useEffect(() => {
    if (hasIntersected) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [hasIntersected, delay]);

  return { elementRef, shouldAnimate, hasIntersected };
};