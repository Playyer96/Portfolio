import React, { useState, useEffect, useRef } from 'react';
import './LazyImage.css';

const LazyImage = ({ src, alt, className, imgClassName, style, ...rest }) => {
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const wrapRef = useRef(null);

  // Reset shimmer when carousel navigates to a new image
  useEffect(() => {
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`lazy-img-wrap${className ? ` ${className}` : ''}`}
      style={style}
    >
      <div className={`lazy-img-shimmer${loaded ? ' lazy-img-shimmer--done' : ''}`} />
      {inView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-img${loaded ? ' lazy-img--loaded' : ''}${imgClassName ? ` ${imgClassName}` : ''}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          {...rest}
        />
      )}
    </div>
  );
};

export default LazyImage;
