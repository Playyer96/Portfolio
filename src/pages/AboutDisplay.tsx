import React from 'react';
import { useApi } from '../hooks/useApi';
import { useScrollAnimation } from '../hooks/useIntersectionObserver';

// Types
interface AboutData {
  title?: string;
  image?: string;
  engines?: string;
  jobTitle?: string;
  description?: string[];
}

const AboutDisplay: React.FC = () => {
  const { data: aboutData, loading, error } = useApi<AboutData[] | AboutData>('/about');
  const { elementRef, shouldAnimate: isVisible } = useScrollAnimation();

  // Handle array response format
  const processedData = Array.isArray(aboutData) && aboutData.length > 0 ? aboutData[0] : aboutData as AboutData;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-48"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          ref={elementRef as React.RefObject<HTMLDivElement>}
          className={`glass-card p-8 md:p-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            {processedData?.image && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                  src={processedData.image}
                  alt="Profile"
                  className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* About Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                  {processedData?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-lg text-gray-600 dark:text-gray-300 mb-6">
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {processedData?.engines}
                  </span>
                  {processedData?.jobTitle && (
                    <>
                      <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                      <span className="font-medium">{processedData.jobTitle}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                {processedData?.description?.map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Decorative Elements */}
              <div className="flex gap-4 pt-6">
                <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full"></div>
                <div className="w-8 h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
                <div className="w-4 h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDisplay;