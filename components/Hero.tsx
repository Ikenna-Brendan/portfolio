'use client';

import { useState, useEffect } from 'react';
import { ArrowDown, Download, MapPin, Mail, LinkedinIcon, GithubIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  resumeUrl: string;
  location: string;
}

interface ContactData {
  email: string;
  linkedin: string;
  github: string;
}

interface HeroProps {
  data: HeroData;
  contact: ContactData;
}

export default function Hero({ data, contact }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResumeDownload = () => {
    // This would typically trigger a download
    window.open(data.resumeUrl, '_blank');
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Location */}
          <div className="flex items-center justify-center gap-2 text-blue-200 mb-12 mt-16">
            <MapPin size={16} />
            <span className="text-sm">{data.location}</span>
          </div>

          {/* Name */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
            {data.name}
          </h1>

          {/* Title */}
          <div className="text-xl md:text-2xl lg:text-3xl text-blue-200 mb-6 font-light">
            {data.title}
          </div>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            {data.tagline}
          </p>

          {/* Bio */}
          <p className="text-base md:text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            {data.bio}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={handleResumeDownload}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Download className="mr-2" size={20} />
              Download Resume
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Mail className="mr-2" size={20} />
              Get In Touch
            </Button>
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-6 mb-16">
            <a 
              href={contact.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
            >
              <LinkedinIcon size={24} />
            </a>
            <a 
              href={contact.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
            >
              <GithubIcon size={24} />
            </a>
          </div>

          {/* Scroll indicator */}
          <button 
            onClick={scrollToNext}
            className="text-gray-400 hover:text-white transition-colors duration-300 animate-bounce"
          >
            <ArrowDown size={32} />
          </button>
        </div>
      </div>
    </section>
  );
}