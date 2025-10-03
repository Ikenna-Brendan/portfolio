import React from 'react';
import Image from 'next/image';
import { OptimizedImage } from '@/utils/image-optimization';

export default function TestImages() {
  const images = [
    { src: '/images/tvmps.JPG', alt: 'TVMPS Project' },
    { src: '/images/bservice.JPG', alt: 'Business Service' },
    // Test with uploads path to ensure fallback works
    { src: '/uploads/tvmps.JPG', alt: 'TVMPS (from uploads)' },
    { src: '/uploads/bservice.JPG', alt: 'Business Service (from uploads)' },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Image Loading Test</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {images.map((img, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div className="relative h-64">
              <OptimizedImage
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-4 bg-gray-50">
              <p className="font-medium">{img.alt}</p>
              <p className="text-sm text-gray-500 break-all">Path: {img.src}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Images in <code>/public/images</code> are prioritized over those in <code>/public/uploads</code></li>
          <li>All images are optimized with automatic format and quality settings</li>
          <li>Base path for GitHub Pages is automatically handled</li>
        </ul>
      </div>
    </div>
  );
}
