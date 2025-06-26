'use client';

import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AboutData {
  summary: string;
  highlights: string[];
}

interface AboutProps {
  data: AboutData;
}

export default function About({ data }: AboutProps) {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto rounded-full"></div>
          </div>

          {/* Content - Full width layout */}
          <div className="space-y-8">
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
              {data.summary}
            </p>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm max-w-3xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Key Highlights</h3>
                <ul className="space-y-3">
                  {data.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}