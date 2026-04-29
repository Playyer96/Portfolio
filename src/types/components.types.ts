/**
 * Component Type Definitions
 *
 * Defines prop types for reusable components
 */

import { ReactNode, CSSProperties } from 'react';
import { IconType } from 'react-icons';
import { Project, Technology, Experience } from './api.types';

// ============================================================================
// Animation Component Props
// ============================================================================

export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

export interface FadeInProps {
  children: ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  className?: string;
}

export interface SlideInProps {
  children: ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  scale?: number;
  className?: string;
}

export interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export interface AnimatedTextProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}

// ============================================================================
// Layout Component Props
// ============================================================================

export interface NavbarProps {
  className?: string;
}

export interface FooterProps {
  className?: string;
}

export interface PageTransitionProps {
  children: ReactNode;
}

export interface SkipLinkProps {
  className?: string;
}

// ============================================================================
// Project Component Props
// ============================================================================

export interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  index: number;
  className?: string;
}

export interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface ProjectItemProps {
  image: string;
  name: string;
  id: string;
  onClick: () => void;
}

// ============================================================================
// Effect Component Props
// ============================================================================

export interface ParticleBackgroundProps {
  particleCount?: number;
  className?: string;
}

// ============================================================================
// UI Component Props
// ============================================================================

// Generic Modal Props (for future modals)
export interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

// Legacy Modal Props (for the old Modal component)
export interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  project: Project | null;
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export interface ImageSliderProps {
  cards: Array<{ image: string; alt: string }>;
  className?: string;
}

export interface VideoPlayerProps {
  url: string;
  className?: string;
}

export interface SkillBarProps {
  name: string;
  level: number;
  color: string;
  delay?: number;
}

// ============================================================================
// Tech Stack Component Props
// ============================================================================

export interface TechBentoProps {
  technologies: Technology[];
  getIconComponent: (techName: string) => IconType | undefined;
  className?: string;
}

export interface TechStackProps {
  technologies: Technology[];
  className?: string;
}

// ============================================================================
// Timeline Component Props
// ============================================================================

export interface TimelineItemProps {
  experience: Experience;
  index: number;
  isEven: boolean;
  className?: string;
}

// ============================================================================
// SEO Component Props
// ============================================================================

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

// ============================================================================
// Error Boundary Props
// ============================================================================

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export interface ErrorFallbackProps {
  error: Error | null;
  errorInfo?: React.ErrorInfo | null;
  resetError?: () => void;
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface UseApiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface UseDebounceOptions {
  delay?: number;
}

export interface UseMousePositionReturn {
  x: number;
  y: number;
}

// ============================================================================
// Common Utility Types
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncFunction<T = void> = () => Promise<T>;
export type VoidFunction = () => void;

// Helper type for making specific properties optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Helper type for making specific properties required
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
