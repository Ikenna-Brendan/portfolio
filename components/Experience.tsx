'use client';

import { Calendar, MapPin, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface ExperienceProps {
  data: ExperienceItem[];
}

export default function Experience({ data }: ExperienceProps) {
  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Experience
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A decade of driving digital transformation and delivering innovative solutions 
              across diverse industries and technical challenges.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-teal-600 rounded-full md:transform md:-translate-x-1/2"></div>

            {/* Experience items */}
            <div className="space-y-12">
              {data.map((experience, index) => (
                <div 
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-4 border-blue-600 md:transform md:-translate-x-1/2 z-10"></div>

                  {/* Content */}
                  <div className={`w-full md:w-1/2 ml-12 md:ml-0 ${
                    index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                  }`}>
                    <Card className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-gray-200 dark:border-gray-700">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <CardTitle className="text-xl text-gray-900 dark:text-white mb-1">
                              {experience.title}
                            </CardTitle>
                            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                              {experience.company}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{experience.period}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{experience.location}</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          {experience.description}
                        </p>

                        {/* Achievements */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Award size={16} />
                            Key Achievements
                          </h4>
                          <ul className="space-y-1">
                            {experience.achievements.map((achievement, achIndex) => (
                              <li key={achIndex} className="text-sm text-gray-700 dark:text-gray-300 pl-4 relative">
                                <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Technologies */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Technologies Used</h4>
                          <div className="flex flex-wrap gap-1">
                            {experience.technologies.map((tech, techIndex) => (
                              <Badge 
                                key={techIndex} 
                                variant="outline" 
                                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}