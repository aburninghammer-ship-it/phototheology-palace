import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  blurDataURL?: string;
  className?: string;
  containerClassName?: string;
}

export function LazyImage({
  src,
  alt,
  placeholderSrc,
  blurDataURL,
  className,
  containerClassName,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Start loading 200px before visible
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Default placeholder - a tiny gray placeholder
  const defaultPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%23f3f4f6' width='1' height='1'/%3E%3C/svg%3E";

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", containerClassName)}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className={cn(
            "absolute inset-0 animate-pulse bg-muted",
            blurDataURL && "bg-cover bg-center"
          )}
          style={blurDataURL ? { backgroundImage: `url(${blurDataURL})` } : undefined}
        />
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      )}

      {/* Fallback for non-IntersectionObserver browsers */}
      {!isInView && (
        <img
          src={placeholderSrc || defaultPlaceholder}
          alt=""
          className={cn("blur-sm", className)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// Utility function to add loading="lazy" to existing img tags
export function withLazyLoading(imgProps: React.ImgHTMLAttributes<HTMLImageElement>) {
  return {
    ...imgProps,
    loading: "lazy" as const,
    decoding: "async" as const,
  };
}
