import './LoadingSkeleton.css';

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'circle';
  width?: string;
  height?: string;
  count?: number;
}

export function LoadingSkeleton({ 
  variant = 'card', 
  width, 
  height, 
  count = 1 
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);
  
  return (
    <>
      {skeletons.map(i => (
        <div
          key={i}
          className={`skeleton skeleton-${variant}`}
          style={{ width, height }}
          aria-label="Loading content"
          role="status"
        />
      ))}
    </>
  );
}
