import React, { useState, useCallback } from 'react';
import ProjectItem from '../components/ProjectItem';
import Modal from '../components/Modal';

// Hooks
import { useApi } from '../hooks/useApi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Utils
import { createSafeImage } from '../utils/imageUtils';

// Types
interface Technology {
  name: string;
}

interface ProjectImage {
  image: string;
  _id?: string;
}

interface Project {
  _id?: string;
  id?: string;
  name: string;
  images?: ProjectImage[];
  imageUrl?: string;
  descriptions?: string | string[];
  technologies?: Technology[];
  responsibilities?: string[];
  link?: string;
  videoUrl?: string;
}

interface ProjectsResponse {
  projects: Project[];
}

interface ProjectsErrorProps {
  error: string;
}

// Utility function to fetch and validate image URLs with fallback
const fetchImageUrl = async (imageUrl: string | undefined): Promise<string> => {
  if (!imageUrl) {
    return await createSafeImage('', 'project');
  }
  
  return await createSafeImage(imageUrl, 'project');
};

// Loading component
const ProjectsLoading: React.FC = () => {
  const { ref: elementRef, isVisible: shouldAnimate } = useScrollAnimation();
  
  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className={`transition-all duration-1000 ${
          shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4" />
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Error component
const ProjectsError: React.FC<ProjectsErrorProps> = ({ error }) => {
  const { ref: elementRef, isVisible: shouldAnimate } = useScrollAnimation();
  
  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className="min-h-screen pt-20 flex items-center justify-center">
      <div className={`glass-card text-center max-w-md transition-all duration-1000 ${
        shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Projects</h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    </div>
  );
};

// Main Projects component
const Projects: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { data: projectsData, loading, error } = useApi<ProjectsResponse[]>('/projects');
  const { ref: elementRef, isVisible: shouldAnimate } = useScrollAnimation();

  // Process projects data
  const processedProjects = React.useMemo(() => {
    if (!projectsData?.[0]?.projects) return [];
    return projectsData[0].projects;
  }, [projectsData]);

  // Fetch images for projects
  const [projectsWithImages, setProjectsWithImages] = useState<Project[]>([]);
  
  React.useEffect(() => {
    const fetchImages = async () => {
      if (processedProjects.length === 0) return;
      
      const updatedProjects = await Promise.all(
         processedProjects.map(async (project) => {
           const safeUrl = await fetchImageUrl(project.images?.[0]?.image);
           return { ...project, imageUrl: safeUrl };
         })
       );
       
       setProjectsWithImages(updatedProjects);
     };
     
     fetchImages();
   }, [processedProjects]);

  // Modal handlers
  const openModal = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
  }, []);

  // Handle loading and error states
  if (loading) return <ProjectsLoading />;
  if (error) return <ProjectsError error={error} />;

  const projectsList = projectsWithImages.length > 0 ? projectsWithImages : processedProjects;

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div ref={elementRef as React.RefObject<HTMLDivElement>} className="relative max-w-7xl mx-auto px-4">
        <div className={`transition-all duration-1000 ${
          shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
              Projects
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A showcase of my creative work and technical expertise across various platforms and technologies
            </p>
          </div>

          {/* Projects Grid */}
          {projectsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectsList.map((project, index) => (
                <div
                  key={project._id || project.id || index}
                  className={`transition-all duration-500 ${
                    shouldAnimate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <ProjectItem
                    name={project.name}
                    image={project.imageUrl || project.images?.[0]?.image || '/default-project.jpg'}
                    onClick={() => openModal(project)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card text-center py-16">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                No Projects Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Check back soon for exciting new projects!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        project={selectedProject}
      />
    </div>
  );
};

export default Projects;