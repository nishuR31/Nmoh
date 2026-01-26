import React, { useState, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
}

const DEFAULT_FALLBACK = '/placeholder.svg';

export const LazyImage = memo<LazyImageProps>(({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className,
  containerClassName,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  }, [imageSrc, fallbackSrc]);

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {/* Skeleton loader */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted/30 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/20 to-transparent animate-shimmer" />
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'grayscale opacity-50',
          className
        )}
        {...props}
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';
