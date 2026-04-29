import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOProps } from '../types';

/**
 * SEO Component
 *
 * Manages meta tags for SEO, Open Graph, and Twitter Cards
 * Uses React Helmet Async for dynamic head management
 */
const SEO: React.FC<SEOProps> = ({
  title = "Danilo Vanegas - Unity & Unreal Game Developer",
  description = "Portfolio showcasing Unity and Unreal game development projects, experience, and technical skills. Specialized in game mechanics, multiplayer systems, and immersive gameplay experiences.",
  keywords = "Unity Developer, Unreal Developer, Game Developer, Portfolio, C#, C++, Game Programming, Multiplayer Games, 3D Games, Danilo Vanegas",
  ogImage = "https://danidev.xyz/og-image.png",
  ogType = "website",
  canonicalUrl = "https://danidev.xyz",
  twitterCard = "summary_large_image"
}) => {
  const author = "Danilo Vanegas";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType || "website"} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || "https://danidev.xyz/og-image.png"} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Danilo Vanegas Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard || "summary_large_image"} />
      {canonicalUrl && <meta name="twitter:url" content={canonicalUrl} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || "https://danidev.xyz/og-image.png"} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:creator" content="@danidev" />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
    </Helmet>
  );
};

export default SEO;
