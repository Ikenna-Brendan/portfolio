'use client';

import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

interface CustomImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  unoptimized?: boolean;
}

export function CustomImage({ 
  src, 
  alt = '',
  unoptimized = true,
  ...props 
}: CustomImageProps) {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (!src) return;

    // Handle different source types
    if (src.startsWith('http') || src.startsWith('data:')) {
      // External URLs or data URIs - use as is
      setImageSrc(src);
    } else if (src.startsWith('/_next/static/media')) {
      // Next.js optimized images - add base path in production
      setImageSrc(process.env.NODE_ENV === 'production' ? `/portfolio${src}` : src);
    } else if (src.startsWith('/uploads/')) {
      // Uploaded images - add base path in production
      setImageSrc(process.env.NODE_ENV === 'production' ? `/portfolio${src}` : src);
    } else {
      // Other local images - ensure they have the correct base path
      setImageSrc(process.env.NODE_ENV === 'production' ? `/portfolio${src}` : src);
    }
  }, [src]);

  if (!imageSrc) {
    // Return a placeholder while the source is being determined
    return (
      <div 
        className="bg-gray-200 dark:bg-gray-800 flex items-center justify-center"
        style={props.width && props.height ? { 
          width: props.width, 
          height: props.height 
        } : undefined}
      >
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      unoptimized={unoptimized}
      {...props}
    />
  );
}
