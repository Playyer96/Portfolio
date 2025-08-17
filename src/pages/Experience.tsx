import React from 'react';
import { HiBriefcase, HiAcademicCap } from 'react-icons/hi';
import {
    VerticalTimeline,
    VerticalTimelineElement
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { useApi } from '../hooks/useApi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Types
interface ExperienceItem {
  title: string;
  subtitle: string;
  date: string;
  responsibilities: string[];
  icon?: string;
  iconBackground?: string;
}

interface ExperienceResponse {
  experience: ExperienceItem[];
}

interface ExperienceErrorProps {
  error: string;
  onRetry: () => void;
}

// Loading Component
const ExperienceLoading: React.FC = () => (
  <div className="min-h-screen py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 mx-auto animate-pulse"></div>
      </div>
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Error Component
const ExperienceError: React.FC<ExperienceErrorProps> = ({ error, onRetry }) => (
  <div className="min-h-screen py-20 px-4 flex items-center justify-center">
    <div className="glass-card p-8 text-center max-w-md">
      <div className="text-red-500 mb-4">
        <HiBriefcase className="w-16 h-16 mx-auto" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Failed to Load Experience
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="btn-primary"
      >
        Try Again
      </button>
    </div>
  </div>
);

const Experience: React.FC = () => {
    const { data: experienceData, loading, error, refetch } = useApi<ExperienceResponse[]>('/experience');
    const { ref, isVisible } = useScrollAnimation();

    // Process the experience data
    const experiences = experienceData?.[0]?.experience || [];

    if (loading) return <ExperienceLoading />;
    if (error) return <ExperienceError error={error} onRetry={refetch} />;

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div 
                    ref={ref as React.RefObject<HTMLDivElement>}
                    className={`text-center mb-16 transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                        Experience
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                        My professional journey and educational background
                    </p>
                </div>
                <VerticalTimeline lineColor="#8b5cf6">
                    {experiences.map((item, index) => (
                        <VerticalTimelineElement
                            key={index}
                            className="vertical-timeline-element--education"
                            date={item.date}
                            iconStyle={{
                                background: item.iconBackground || '#8b5cf6',
                                color: '#fff',
                                boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                            }}
                            icon={item.icon === 'WorkIcon' ? <HiBriefcase /> : <HiAcademicCap />}
                            contentStyle={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                            }}
                            contentArrowStyle={{
                                borderRight: '7px solid rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                {item.title}
                            </h3>
                            <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-4">
                                {item.subtitle}
                            </h4>
                            <div className="space-y-2">
                                {item.responsibilities?.map((responsibility: string, subIndex: number) => (
                                    <p key={subIndex} className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        • {responsibility}
                                    </p>
                                ))}
                            </div>
                        </VerticalTimelineElement>
                    ))}
                </VerticalTimeline>
            </div>
        </div>
    );
};

export default Experience;