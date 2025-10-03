import React from 'react';
import ProjectShowcase from '@/components/ProjectShowcase';

export const metadata = {
  title: 'Projects | My Portfolio',
  description: 'Check out my latest projects and work samples.',
};

export default function ProjectsPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">My Projects</h1>
      <ProjectShowcase />
    </main>
  );
}
