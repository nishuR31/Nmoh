import React, { memo, ReactNode, CSSProperties } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

type AnimationType = 
  | 'fade-up' 
  | 'fade-down' 
  | 'fade-left' 
  | 'fade-right' 
  | 'zoom-in' 
  | 'zoom-out'
  | 'flip-up'
  | 'slide-up'
  | 'blur-in';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const animationStyles: Record<AnimationType, { initial: CSSProperties; visible: CSSProperties }> = {
  'fade-up': {
    initial: { opacity: 0, transform: 'translateY(40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-down': {
    initial: { opacity: 0, transform: 'translateY(-40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-left': {
    initial: { opacity: 0, transform: 'translateX(-40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    initial: { opacity: 0, transform: 'translateX(40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  'zoom-in': {
    initial: { opacity: 0, transform: 'scale(0.9)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'zoom-out': {
    initial: { opacity: 0, transform: 'scale(1.1)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
  'flip-up': {
    initial: { opacity: 0, transform: 'perspective(1000px) rotateX(20deg) translateY(20px)' },
    visible: { opacity: 1, transform: 'perspective(1000px) rotateX(0) translateY(0)' },
  },
  'slide-up': {
    initial: { opacity: 0, transform: 'translateY(100%)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  'blur-in': {
    initial: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0)' },
  },
};

export const ScrollReveal = memo<ScrollRevealProps>(({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className,
  once = true,
}) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold,
    triggerOnce: once,
  });

  const styles = animationStyles[animation];
  const currentStyle = isVisible ? styles.visible : styles.initial;

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        ...currentStyle,
        transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';

// Staggered container for child animations
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer = memo<StaggerContainerProps>(({
  children,
  staggerDelay = 100,
  className,
}) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        return (
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: `all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * staggerDelay}ms`,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
});

StaggerContainer.displayName = 'StaggerContainer';
