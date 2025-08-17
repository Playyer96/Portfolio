declare module 'react-vertical-timeline-component' {
  import { ReactNode } from 'react';

  export interface VerticalTimelineProps {
    animate?: boolean;
    className?: string;
    layout?: '1-column-left' | '1-column-right' | '2-columns';
    lineColor?: string;
    children?: ReactNode;
  }

  export interface VerticalTimelineElementProps {
    className?: string;
    contentArrowStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    date?: string;
    dateClassName?: string;
    icon?: ReactNode;
    iconClassName?: string;
    iconOnClick?: () => void;
    iconStyle?: React.CSSProperties;
    id?: string;
    intersectionObserverProps?: {
      root?: Element | null;
      rootMargin?: string;
      threshold?: number | number[];
    };
    onTimelineElementClick?: () => void;
    position?: 'left' | 'right';
    style?: React.CSSProperties;
    textClassName?: string;
    visible?: boolean;
    children?: ReactNode;
  }

  export const VerticalTimeline: React.FC<VerticalTimelineProps>;
  export const VerticalTimelineElement: React.FC<VerticalTimelineElementProps>;

  export default VerticalTimeline;
}