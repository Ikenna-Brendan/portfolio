'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Project {
  title: string;
  company: string;
  description: string;
  image: string;
  technologies: string[];
  features: string[];
  impact: string;
}

interface ProjectFiltersProps {
  projects: Project[];
  onFilterChange: (filteredProjects: Project[]) => void;
}

export default function ProjectFilters({ projects, onFilterChange }: ProjectFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  // Get all unique technologies from projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.technologies?.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter projects based on search and technology filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Technology filter
      const matchesTechnologies = selectedTechnologies.length === 0 ||
        selectedTechnologies.some(tech => project.technologies?.includes(tech));

      return matchesSearch && matchesTechnologies;
    });
  }, [projects, searchTerm, selectedTechnologies]);

  // Update parent component when filters change
  useMemo(() => {
    onFilterChange(filteredProjects);
  }, [filteredProjects, onFilterChange]);

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTechnologies([]);
  };

  const hasActiveFilters = searchTerm || selectedTechnologies.length > 0;

  return (
    <div className="space-y-4 mb-8">
      {/* Search and Clear */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} size="sm" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Technology Filters */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Technology:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTechnologies.map(tech => (
            <Badge
              key={tech}
              variant={selectedTechnologies.includes(tech) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedTechnologies.includes(tech)
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900"
              }`}
              onClick={() => toggleTechnology(tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredProjects.length} of {projects.length} projects
        {hasActiveFilters && (
          <span className="ml-2">
            (filtered)
          </span>
        )}
      </div>
    </div>
  );
} 