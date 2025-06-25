'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Server, Cloud, Users, BarChart3 } from 'lucide-react';

interface SkillsData {
  [category: string]: string[];
}

interface SkillsProps {
  data: SkillsData;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  'Software & Architecture': <Code className="text-blue-600" size={24} />,
  'Systems & Infrastructure': <Server className="text-green-600" size={24} />,
  'Cloud & DevOps': <Cloud className="text-purple-600" size={24} />,
  'Project & Team Leadership': <Users className="text-orange-600" size={24} />,
  'Data & Analytics': <BarChart3 className="text-teal-600" size={24} />
};

export default function Skills({ data }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Skills & Expertise
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive toolkit spanning full-stack development, infrastructure management, 
              and strategic technology leadership across diverse industries.
            </p>
          </div>

          {/* Skills grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(data).map(([category, skills]) => (
              <Card 
                key={category}
                className={`transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-2 ${
                  activeCategory === category ? 'ring-2 ring-blue-500 shadow-xl' : ''
                }`}
                onMouseEnter={() => setActiveCategory(category)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    {categoryIcons[category]}
                    <span className="text-gray-900">{category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className={`transition-all duration-300 ${
                          activeCategory === category 
                            ? 'bg-blue-100 text-blue-800 border-blue-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive showcase */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                {activeCategory || 'Versatile Technology Leadership'}
              </h3>
              <p className="text-blue-100 max-w-2xl mx-auto">
                {activeCategory 
                  ? `${data[activeCategory].length} technologies in ${activeCategory.toLowerCase()} delivering enterprise-grade solutions.`
                  : 'Hover over skill categories above to explore my expertise in each domain. From code to cloud, I bridge technical implementation with business strategy.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}