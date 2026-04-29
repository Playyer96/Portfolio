/**
 * Type Definitions - Central Export
 *
 * Re-exports all types from a single location for easier imports
 *
 * Usage:
 * import { Project, ProjectCardProps, Technology } from '@types';
 */

// API Types
export type {
  Technology,
  TechnologyCategory,
  Project,
  ProjectImage,
  Experience,
  Skill,
  Service,
  About,
  ApiResponse,
  ApiArrayResponse,
  ApiError,
  LoadingState,
  DataState,
} from './api.types';

// Case Study Types
export type {
  CaseStudy,
  Challenge,
  Solution,
  Result,
  Metric,
} from './caseStudy.types';

// Component Types
export type {
  AnimationDirection,
  FadeInProps,
  SlideInProps,
  ScaleInProps,
  StaggerContainerProps,
  AnimatedTextProps,
  NavbarProps,
  FooterProps,
  PageTransitionProps,
  SkipLinkProps,
  ProjectCardProps,
  ProjectModalProps,
  ProjectItemProps,
  ParticleBackgroundProps,
  ModalProps,
  GenericModalProps,
  ButtonProps,
  CardProps,
  ImageSliderProps,
  VideoPlayerProps,
  SkillBarProps,
  TechBentoProps,
  TechStackProps,
  TimelineItemProps,
  SEOProps,
  ErrorBoundaryProps,
  ErrorFallbackProps,
  UseApiDataReturn,
  UseDebounceOptions,
  UseMousePositionReturn,
  Nullable,
  Optional,
  AsyncFunction,
  VoidFunction,
  PartialBy,
  RequiredBy,
} from './components.types';
