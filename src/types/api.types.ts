/**
 * API Type Definitions
 *
 * Defines the structure of data returned from the portfolio backend API
 */

// ============================================================================
// Technology Types
// ============================================================================

export interface Technology {
  name: string;
  text?: string;
  icon?: string;
  category?: string;
  level?: number;
}

export interface TechnologyCategory {
  category: string;
  technologies: Technology[];
}

// ============================================================================
// Project Types
// ============================================================================

import { CaseStudy } from './caseStudy.types';

export interface ProjectImage {
  image: string;
  alt?: string;
}

export interface Project {
  _id: string;
  id?: string;
  name: string;
  descriptions: string[];
  description?: string;
  images: ProjectImage[];
  imageUrl?: string;
  technologies: Technology[];
  responsibilities?: string[];
  videoUrl?: string;
  video?: string;
  githubLink?: string;
  liveLink?: string;
  link?: string; // Legacy link property for old Modal component
  featured?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  caseStudy?: CaseStudy; // Optional detailed case study
}

// ============================================================================
// Experience Types
// ============================================================================

export interface Experience {
  _id: string;
  id?: string;
  title: string;
  subtitle?: string; // For TimelineItem component (company or institution)
  company?: string;
  institution?: string;
  location?: string;
  date?: string; // For TimelineItem component (formatted date range)
  startDate: string;
  endDate?: string;
  current?: boolean;
  type: 'work' | 'education';
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: Technology[];
  icon?: string;
}

// ============================================================================
// About Types
// ============================================================================

export interface Skill {
  name: string;
  level: number;
  category?: string;
}

export interface Service {
  title: string;
  description: string;
  icon?: string;
}

export interface About {
  _id?: string;
  name: string;
  title: string;
  bio: string;
  description?: string[]; // Array of description paragraphs
  image?: string; // Profile image URL
  engines?: string; // Game engines (e.g., "Unreal & Unity")
  jobTitle?: string; // Job title (e.g., "Game Programmer")
  email?: string;
  phone?: string;
  location?: string;
  skills?: Skill[];
  services?: Service[];
  stats?: {
    label: string;
    value: string | number;
  }[];
}

// ============================================================================
// API Response Wrappers
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiArrayResponse<T> {
  projects?: T[];
  technologies?: T[];
  experiences?: T[];
  data?: T[];
}

// ============================================================================
// API Error Types
// ============================================================================

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

// ============================================================================
// Loading State Types
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  error: Error | null;
}

export interface DataState<T> extends LoadingState {
  data: T | null;
}
