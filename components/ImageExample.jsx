import React from 'react';
import Image from 'next/image';
import { OptimizedImage, BackgroundImage } from '@/utils/image-optimization';

const ImageExample = () => {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Optimized Image Component</h2>
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
          <OptimizedImage
            src="/images/example.jpg"
            alt="Example image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Background Image Component</h2>
        <BackgroundImage
          src="/images/background.jpg"
          className="w-full h-64 md:h-96 rounded-lg flex items-center justify-center"
        >
          <div className="bg-black bg-opacity-50 text-white p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold">Content Over Image</h3>
            <p>This text is overlaid on a background image</p>
          </div>
        </BackgroundImage>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Standard Next.js Image</h2>
        <div className="relative w-full h-64 md:h-96">
          <Image
            src="/images/example.jpg"
            alt="Standard Next.js Image"
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageExample;
