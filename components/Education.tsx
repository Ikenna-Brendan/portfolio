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

interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
  description: string;
}

interface EducationProps {
  education: EducationItem[];
  certifications: CertificationItem[];
}

export default function Education({ education, certifications }: EducationProps) {
  return (
    <section id="education" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Education & Certifications
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Continuous learning and professional development spanning academic achievements 
              and industry certifications.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <GraduationCap className="text-blue-600" size={28} />
                Academic Background
              </h3>
              
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <Card key={index} className="shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">
                        {edu.degree}
                      </CardTitle>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600 font-medium">{edu.institution}</span>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar size={12} />
                          {edu.year}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Award className="text-green-600" size={28} />
                Professional Certifications
              </h3>
              
              <div className="space-y-6">
                {certifications.map((cert, index) => (
                  <Card key={index} className="shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">
                        {cert.name}
                      </CardTitle>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 font-medium">{cert.issuer}</span>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar size={12} />
                          {cert.year}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{cert.description}</p>
                    </CardContent>
                  </Card>
                ))}

                {/* Future certifications placeholder */}
                <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-teal-50 border-dashed border-2 border-blue-300">
                  <CardContent className="p-6 text-center">
                    <Award className="text-blue-400 mx-auto mb-4" size={32} />
                    <h4 className="font-semibold text-gray-900 mb-2">Continuous Learning</h4>
                    <p className="text-sm text-gray-600">
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