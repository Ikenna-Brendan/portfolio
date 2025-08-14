'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Code, Zap, FolderOpen } from 'lucide-react';
import ProjectFilters from './ProjectFilters';
import { trackProjectView } from '@/lib/analytics';

interface Project {
  title: string;
  company: string;
  description: string;
  image: string;
  technologies: string[];
  features: string[];
  impact: string;
}

interface ProjectsProps {
  data: Project[];
}

export default function Projects({ data }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(data);

  // Log when filtered projects change
  useEffect(() => {
    console.log('Filtered projects updated:', filteredProjects);
  }, [filteredProjects]);

  // Reset filtered projects when data changes
  useEffect(() => {
    setFilteredProjects(data);
  }, [data]);

  const handleProjectClick = (project: Project) => {
    trackProjectView(project.title);
  };

  // Handle filter changes
  const handleFilterChange = (projects: Project[]) => {
    console.log('Filter changed. Filtered projects:', projects);
    setFilteredProjects(projects);
  };

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Showcasing innovative solutions that have driven measurable business impact 
              and technical excellence across various industries.
            </p>
          </div>

          {/* Project Filters */}
          <ProjectFilters 
            projects={data} 
            onFilterChange={handleFilterChange}
          />

          {/* Projects grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredProjects.map((project, index) => (
                <Card 
                  key={index}
                  className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 dark:bg-gray-800 dark:border-gray-700 ${
                    selectedProject === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedProject(selectedProject === index ? null : index);
                    handleProjectClick(project);
                  }}
                >
                  {/* Project image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <Badge className="bg-blue-600 hover:bg-blue-700">
                        {project.company}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center justify-between">
                      {project.title}
                      <Code className="text-blue-600" size={20} />
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Expandable details */}
                    {selectedProject === index && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 animate-in slide-in-from-top-2 duration-300">
                        {/* Features */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Key Features</h4>
                          <ul className="space-y-1">
                            {project.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="text-sm text-gray-700 dark:text-gray-300 pl-4 relative">
                                <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Impact */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="text-green-600" size={16} />
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Business Impact</h4>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{project.impact}</p>
                        </div>
                      </div>
                    )}

                    {/* Action button */}
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(selectedProject === index ? null : index);
                          handleProjectClick(project);
                        }}
                        className="w-full"
                      >
                        {selectedProject === index ? 'Show Less' : 'View Details'}
                        <ExternalLink size={14} className="ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}