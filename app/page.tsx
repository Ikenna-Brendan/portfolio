'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollProgress from '@/components/ScrollProgress';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Education from '@/components/Education';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ContentManager from '@/components/ContentManager';
import LoadingSpinner from '@/components/LoadingSpinner';
import ThemeToggle from '@/components/ThemeToggle';
import { trackPageView } from '@/lib/analytics';
import { contentSynchronizer } from '@/lib/contentSync';
import { storage } from '@/lib/storage';
import type { Content as ContentType, BlogPost as BlogPostType, ProjectItem } from '@/types';

// Fallback content in case of errors
const FALLBACK_CONTENT: ContentType = {
  hero: {
    name: 'Ikenna B Iwuoha',
    title: 'Full-Stack Technologist & Digital Solutions Architect',
    tagline: 'From Infrastructure to AI-Delivering Scalable, Secure, and Insightful Technology Solutions.',
    bio: '15+ years of experience delivering enterprise solutions across automotive, healthcare, retail, and education sectors. Passionate about transforming complex business challenges into elegant technical solutions.',
    resumeUrl: '/resume-ikenna-iwuoha.pdf',
    location: 'Ireland'
  },
  about: {
    summary: 'With over a decade in technology spanning multiple industries, I bring a unique blend of technical depth and business acumen.',
    highlights: [
      '15+ years across automotive, healthcare, retail, and education industries',
      'Versatile expertise: software engineering, ERP, DevOps, cloud, and AI'
    ]
  },
  skills: {
    'Frontend': ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    'Backend': ['Node.js', 'Python', 'Java', 'C#'],
    'Cloud': ['AWS', 'Azure', 'Docker', 'Kubernetes'],
    'DevOps': ['CI/CD', 'Terraform', 'Ansible', 'GitHub Actions']
  },
  experience: [],
  projects: [],
  education: [],
  blog: [],
  contact: {
    email: 'contact@example.com',
    linkedin: 'https://linkedin.com/in/example',
    github: 'https://github.com/example',
    location: 'Dublin, Ireland',
    available: true
  }
};

export default function Home() {
  const [content, setContent] = useState<ContentType | null>(null);
  const [showCMS, setShowCMS] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map the content to match the expected component props
  const blogPosts: BlogPostType[] = content?.blog?.map(post => ({
    ...post,
    readTime: post.readTime || '5 min read',
    image: post.image || '/images/blog-placeholder.jpg'
  })) || [];

  const projects: ProjectItem[] = content?.projects?.map(project => ({
    ...project,
    company: project.company || 'Freelance',
    image: project.image || '/images/project-placeholder.jpg',
    features: project.features || [],
    impact: project.impact || 'Improved business processes and user experience.'
  })) || [];

  // Load content when component mounts
  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        // Track page view
        trackPageView('home');
        
        // Try to load from localStorage first
        const localContent = await contentSynchronizer.getContent();
        if (isMounted) {
          setContent(localContent);
          setIsLoading(false);
        }
        
        // Then try to sync from server in the background
        try {
          const serverContent = await contentSynchronizer.syncFromServer();
          if (isMounted && serverContent) {
            setContent(serverContent);
          }
        } catch (syncError) {
          console.warn('Background sync failed:', syncError);
        }
      } catch (err) {
        console.error('Error loading content:', err);
        if (isMounted) {
          setError('Failed to load content. Using fallback content.');
          setContent(FALLBACK_CONTENT);
          setIsLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Handle content updates from the CMS
   */
  const handleContentSave = async (updatedContent: ContentType): Promise<void> => {
    try {
      // Validate the content structure before saving
      if (!updatedContent?.hero || !updatedContent?.skills) {
        throw new Error('Invalid content structure: missing required fields');
      }
      
      // Save using the content synchronizer
      const result = await contentSynchronizer.updateContent(updatedContent);
      
      if (result.success) {
        setContent(updatedContent);
        setShowCMS(false);
        alert('Content updated successfully!');
      } else {
        throw new Error(result.error || 'Failed to update content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert(`Failed to save content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800">
        <LoadingSpinner size="xl" text="Loading portfolio..." />
      </div>
    );
  }

  // Show error state if content failed to load
  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Failed to load portfolio content
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-6">
            {error || 'An unknown error occurred'}
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="bg-white dark:bg-gray-800"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => setContent(FALLBACK_CONTENT)}
              variant="outline"
            >
              Use Offline Version
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative">
      {/* Scroll Progress Bar */}
      <ScrollProgress />
      
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* CMS Access Button - Always show in development */}
      {(process.env.NODE_ENV === 'development' || 
        process.env.NEXT_PUBLIC_SHOW_CMS === 'true' ||
        typeof window !== 'undefined' && window.location.search.includes('cms=true')) && (
        <Button
          onClick={() => setShowCMS(true)}
          className="fixed top-4 right-4 z-40 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white shadow-lg"
          size="sm"
          aria-label="Open Content Management System"
        >
          <Settings size={16} className="mr-2" />
          CMS
        </Button>
      )}

      {/* Main Content */}
      <div className="transition-opacity duration-300">
        <Hero data={content.hero} contact={content.contact} />
        <About data={content.about} />
        <Skills data={content.skills} />
        <Experience data={content.experience} />
        <Projects data={projects} />
        <Education education={content.education} certifications={content.certifications || []} />
        <Blog data={blogPosts} />
        <Contact data={content.contact} />
        <Footer />
      </div>

      {/* Content Management System */}
      <ContentManager
        isVisible={showCMS}
        onClose={() => setShowCMS(false)}
        onSave={handleContentSave}
        currentContent={content}
      />
    </main>
  );
}