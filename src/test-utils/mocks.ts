/**
 * Mock Data for Tests
 *
 * Centralized mock data matching API response structures
 */

import { Project, Technology, Experience, About } from '../types';

export const mockTechnologies: Technology[] = [
  {
    name: 'React',
    text: 'React',
    icon: 'react',
    category: 'frontend',
  },
  {
    name: 'TypeScript',
    text: 'TypeScript',
    icon: 'typescript',
    category: 'language',
  },
  {
    name: 'Node.js',
    text: 'Node.js',
    icon: 'nodejs',
    category: 'backend',
  },
  {
    name: 'Unity',
    text: 'Unity',
    icon: 'unity',
    category: 'gamedev',
  },
  {
    name: 'Unreal Engine',
    text: 'Unreal Engine',
    icon: 'unreal',
    category: 'gamedev',
  },
];

export const mockProjects: Project[] = [
  {
    _id: '1',
    name: 'Test Project 1',
    descriptions: [
      'A test project for unit testing',
      'Built with React and TypeScript',
    ],
    images: [
      { image: 'https://example.com/image1.jpg' },
      { image: 'https://example.com/image2.jpg' },
    ],
    technologies: [
      { name: 'React', text: 'React', icon: 'react' },
      { name: 'TypeScript', text: 'TypeScript', icon: 'typescript' },
    ],
    responsibilities: [
      'Frontend development',
      'UI/UX implementation',
    ],
    githubLink: 'https://github.com/test/project1',
    liveLink: 'https://project1.example.com',
  },
  {
    _id: '2',
    name: 'Test Project 2',
    descriptions: [
      'Another test project',
      'Game development with Unity',
    ],
    images: [
      { image: 'https://example.com/game1.jpg' },
    ],
    technologies: [
      { name: 'Unity', text: 'Unity', icon: 'unity' },
      { name: 'C#', text: 'C#', icon: 'csharp' },
    ],
    videoUrl: 'https://example.com/video.mp4',
    responsibilities: [
      'Gameplay programming',
      'Physics implementation',
    ],
  },
  {
    _id: '3',
    name: 'Full Stack App',
    descriptions: [
      'Full stack application',
    ],
    images: [
      { image: 'https://example.com/fullstack.jpg' },
    ],
    technologies: [
      { name: 'React', text: 'React', icon: 'react' },
      { name: 'Node.js', text: 'Node.js', icon: 'nodejs' },
    ],
  },
];

export const mockExperiences: Experience[] = [
  {
    _id: '1',
    title: 'Senior Frontend Developer',
    subtitle: 'Tech Company Inc.',
    company: 'Tech Company Inc.',
    startDate: '2022-01-01',
    current: true,
    date: '2022 - Present',
    type: 'work',
    description: 'Building modern web applications with React and TypeScript',
    icon: 'work',
  },
  {
    _id: '2',
    title: 'Game Developer',
    subtitle: 'Game Studio',
    company: 'Game Studio',
    startDate: '2020-01-01',
    endDate: '2022-12-31',
    date: '2020 - 2022',
    type: 'work',
    description: 'Developed gameplay mechanics and systems for mobile games',
    icon: 'work',
  },
  {
    _id: '3',
    title: 'Computer Science Degree',
    subtitle: 'University Name',
    institution: 'University Name',
    startDate: '2016-09-01',
    endDate: '2020-05-31',
    date: '2016 - 2020',
    type: 'education',
    description: 'Bachelor of Science in Computer Science',
    icon: 'school',
  },
];

export const mockAbout: About = {
  _id: '1',
  name: 'Test Developer',
  title: 'Full Stack Developer & Game Programmer',
  bio: 'Passionate developer with experience in web and game development.',
  jobTitle: 'Full Stack Developer',
  description: [
    'Passionate developer with experience in web and game development.',
    'Specialized in React, TypeScript, and Unity.',
  ],
  image: 'https://example.com/profile.jpg',
  engines: 'Unity & Unreal',
  skills: [
    { name: 'React', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'Unity', level: 80 },
    { name: 'Node.js', level: 75 },
  ],
};

// Mock API responses
export const mockApiResponses = {
  technologies: [{ technologies: mockTechnologies }],
  projects: [{ projects: mockProjects }],
  experiences: [{ experiences: mockExperiences }],
  about: [{ about: mockAbout }],
};
