'use client';

import { GraduationCap, Award, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  description: string;
}

// Import shared types
import { CertificationItem } from '@/types';

interface EducationProps {
  education: EducationItem[];
  certifications: CertificationItem[];
}

export default function Education({ education, certifications }: EducationProps) {
  return (
    <section id="education" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Education & Certifications
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Continuous learning and professional development spanning academic achievements 
              and industry certifications.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <GraduationCap className="text-blue-600 dark:text-blue-400" size={28} />
                Academic Background
              </h3>
              
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <Card key={index} className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900 dark:text-white">
                        {edu.degree}
                      </CardTitle>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">{edu.institution}</span>
                        <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                          <Calendar size={12} />
                          {edu.year}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{edu.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <Award className="text-green-600 dark:text-green-400" size={28} />
                Professional Certifications
              </h3>
              
              <div className="space-y-6">
                {certifications.map((cert, index) => (
                  <Card key={index} className="shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900 dark:text-white">
                        {cert.name}
                      </CardTitle>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400 font-medium">{cert.issuer}</span>
                        <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                          <Calendar size={12} />
                          {cert.year}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{cert.description}</p>
                    </CardContent>
                  </Card>
                ))}

                {/* Future certifications placeholder */}
                <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border-dashed border-2 border-blue-300 dark:border-blue-600">
                  <CardContent className="p-6 text-center">
                    <Award className="text-blue-400 dark:text-blue-300 mx-auto mb-4" size={32} />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Continuous Learning</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Currently pursuing additional certifications in Google Cloud, 
                      Azure, and advanced project management methodologies.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}