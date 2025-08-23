'use client';

import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

interface CustomImageProps extends Omit<ImageProps, 'src'> {
  src: string;
}

export function CustomImage({ src, alt, ...props }: CustomImageProps) {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    // If the image is from the uploads directory, handle it specially
    if (src.startsWith('/uploads/')) {
      // In development, use the path as-is
      if (process.env.NODE_ENV === 'development') {
        setImageSrc(src);
      } else {
        // In production, ensure the base path is included
        setImageSrc(`/portfolio${src}`);
      }
    } else {
      // For other images, use the path as-is
      setImageSrc(src);
    }
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt={alt || ''}
      unoptimized={true}
      {...props}
    />
  );
}
