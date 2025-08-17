import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaReact, FaUnity, FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaPython, FaGitAlt, FaGithub, FaGitlab, FaDocker, FaSlack, FaJira } from 'react-icons/fa';
import { SiUnrealengine, SiCplusplus, SiCsharp, SiPerforce } from 'react-icons/si';
import { HiArrowRight } from 'react-icons/hi';
import { IconType } from 'react-icons';

// Hooks
import { useApi } from '../hooks/useApi';
import { useScrollAnimation } from '../hooks/useIntersectionObserver';

// Components
import CardDisplay from '../components/CardDisplay';
import ContactIcons from '../components/ContactIcons';

// Types
interface Technology {
  text: string;
}

interface TechnologiesResponse {
  technologies: Technology[];
}

// Technology icon mapping
const getTechnologyIcon = (techName: string): IconType => {
  const iconMap: Record<string, IconType> = {
    'react': FaReact,
    'unity engine': FaUnity,
    'unreal engine': SiUnrealengine,
    'html5': FaHtml5,
    'css 3': FaCss3Alt,
    'javascript': FaJs,
    'nodejs': FaNodeJs,
    'python': FaPython,
    'c++': SiCplusplus,
    'c#': SiCsharp,
    'git': FaGitAlt,
    'github': FaGithub,
    'gitlab': FaGitlab,
    'docker': FaDocker,
    'slack': FaSlack,
    'jira': FaJira,
    'perforce': SiPerforce,
  };
  
  return iconMap[techName?.toLowerCase()] || FaReact;
};

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { elementRef, shouldAnimate } = useScrollAnimation();

  return (
    <section
      ref={elementRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className={`relative z-10 text-center max-w-4xl mx-auto px-4 transition-all duration-1000 ${
        shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="glass-card mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hi, I'm{' '}
            <span className="font-kaushan text-gradient animate-glow">
              Dani
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Unreal and Unity developer with a passion to learn new technologies
            and create immersive experiences
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <ContactIcons />
          </div>
          
          <button
            onClick={() => navigate('/about')}
            className="btn-primary group inline-flex items-center gap-2 text-lg"
          >
            About Me
            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

const TechnologiesSection: React.FC = () => {
  const { data: technologies, loading, error } = useApi<TechnologiesResponse[]>('/technologies');
  const { elementRef, shouldAnimate } = useScrollAnimation(200);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="glass-card">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-300 dark:bg-gray-600 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="glass-card">
            <h2 className="text-3xl font-bold text-red-500 mb-4">Error Loading Technologies</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const techList = technologies?.[0]?.technologies || [];

  return (
    <section ref={elementRef} className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className={`transition-all duration-1000 delay-200 ${
          shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Technologies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Tools and technologies I work with to bring ideas to life
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {techList.map((tech, index) => {
              const IconComponent = getTechnologyIcon(tech.text);
              
              return (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <CardDisplay
                    icon={IconComponent}
                    tooltip={tech.text}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  return (
    <div className="relative">
      <HeroSection />
      <TechnologiesSection />
    </div>
  );
};

export default React.memo(Home);