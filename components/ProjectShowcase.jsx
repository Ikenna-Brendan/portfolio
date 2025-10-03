import React from 'react';
import { OptimizedImage } from '@/utils/image-optimization';

const ProjectShowcase = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64">
          <OptimizedImage
            src="/images/tvmps.JPG"
            alt="TVMPS Project"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">TVMPS Project</h3>
          <p className="text-gray-600">
            A showcase of the TVMPS project with responsive image loading.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64">
          <OptimizedImage
            src="/images/bservice.JPG"
            alt="Business Service"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">Business Service</h3>
          <p className="text-gray-600">
            Professional business service with optimized image delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;
