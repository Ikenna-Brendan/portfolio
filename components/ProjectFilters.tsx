'use client';

import { useState, useMemo, useEffect } from 'react';
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
    console.log('=== PROJECT TECHNOLOGIES DEBUG ===');
    
    projects.forEach((project, index) => {
      console.group(`Project ${index + 1}: ${project.title}`);
      console.log('Full project data:', JSON.parse(JSON.stringify(project)));
      console.log('Technologies:', project.technologies);
      console.log('Type of technologies:', typeof project.technologies);
      console.log('Is array:', Array.isArray(project.technologies));
      
      if (Array.isArray(project.technologies)) {
        project.technologies.forEach((tech, techIndex) => {
          console.log(`  Tech ${techIndex + 1}:`, {
            raw: tech,
            stringValue: String(tech),
            type: typeof tech,
            trimmed: String(tech).trim(),
            lowerCase: String(tech).toLowerCase()
          });
          
          if (tech) {
            const techValue = String(tech).trim();
            if (techValue) {
              techSet.add(techValue);
            }
          }
        });
      } else if (project.technologies) {
        console.warn('Project technologies is not an array:', project.technologies);
      }
      
      console.groupEnd();
    });
    
    const techArray = Array.from(techSet).sort();
    console.log('=== AVAILABLE TECHNOLOGIES ===', techArray);
    return techArray;
  }, [projects]);

  // Filter projects based on search and technology filters
  const filteredProjects = useMemo(() => {
    console.log('Filtering projects with:', { searchTerm, selectedTechnologies });
    
    return projects.filter(project => {
      // Search filter - matches if search is empty or matches title/description/technologies
      const searchLower = searchTerm.toLowerCase().trim();
      
      // Check if search term matches project title or description
      const matchesTitle = project.title.toLowerCase().includes(searchLower);
      const matchesDescription = (project.description?.toLowerCase() || '').includes(searchLower);
      
      // Check if search term matches any technology (case-insensitive)
      const matchesTechnology = project.technologies?.some(tech => 
        String(tech).toLowerCase().includes(searchLower)
      ) || false;
      
      const matchesSearch = searchTerm === '' || matchesTitle || matchesDescription || matchesTechnology;
      
      if (searchTerm && !matchesSearch) {
        console.log(`No match for '${searchTerm}' in project '${project.title}'`);
      }

      // Technology filter - matches if no technologies selected or all selected techs are in project
      const matchesTechnologies = selectedTechnologies.length === 0 ||
        selectedTechnologies.every(selectedTech => {
          if (!selectedTech) return false;
          
          // Normalize the selected technology
          const selectedTechLower = String(selectedTech).toLowerCase().trim();
          
          // Check if project has technologies and find a match
          const hasMatch = project.technologies?.some(projectTech => {
            if (!projectTech) return false;
            // Convert to string, lowercase, and trim for comparison
            const projectTechStr = String(projectTech).toLowerCase().trim();
            
            // Check if the project's technology includes the search term
            const isMatch = projectTechStr.includes(selectedTechLower);
            
            if (isMatch) {
              console.log(`Match found: '${projectTechStr}' includes '${selectedTechLower}'`);
            } else {
              console.log(`No match: '${projectTechStr}' does not include '${selectedTechLower}'`);
            }
            
            return isMatch;
          });
          
          if (!hasMatch) {
            console.log(`No match for '${selectedTech}' in project '${project.title}'`);
            console.log('Project technologies:', project.technologies);
          }
          
          return hasMatch === true;
        });

      // Log detailed debugging info for each project
      if (selectedTechnologies.length > 0) {
        console.log(`Project: ${project.title}`, {
          matchesSearch,
          matchesTechnologies,
          projectTechnologies: project.technologies,
          selectedTechnologies,
          searchTerm
        });
      }

      return matchesSearch && matchesTechnologies;
    });
  }, [projects, searchTerm, selectedTechnologies]);

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filteredProjects);
  }, [filteredProjects, onFilterChange]);

  const toggleTechnology = (tech: string) => {
    console.log('Toggling technology:', tech);
    console.log('Current selected technologies before:', selectedTechnologies);
    
    setSelectedTechnologies(prev => {
      const newSelection = prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech];
      
      console.log('New selected technologies:', newSelection);
      return newSelection;
    });
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
          <Button 
            variant="outline" 
            onClick={clearFilters} 
            size="sm" 
            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
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
              onClick={(e) => {
                console.log('Technology badge clicked:', tech);
                e.preventDefault();
                e.stopPropagation();
                toggleTechnology(tech);
              }}
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
          <span className="ml-2">(filtered)</span>
        )}
      </div>
    </div>
  );
}