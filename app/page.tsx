'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import ScrollProgress from '@/components/ScrollProgress';
import { storage } from '@/lib/storage';
import { trackPageView } from '@/lib/analytics';

export default function Home() {
  const [content, setContent] = useState<any>(null);
  const [showCMS, setShowCMS] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Track page view
    trackPageView('home');

    // Load content with localStorage fallback
    const loadContent = async () => {
      try {
        // First try to load from localStorage
        const storedContent = storage.loadContent();
        
        if (storedContent) {
          console.log('Loaded content from localStorage');
          setContent(storedContent);
        } else {
          // Fallback to JSON file
          console.log('Loading content from JSON file');
          const response = await fetch('/data/content.json');
          const data = await response.json();
          setContent(data);
          // Save to localStorage for future use
          storage.saveContent(data);
        }
      } catch (error) {
        console.error('Failed to load content:', error);
        // Fallback content
        const fallbackContent = {
          hero: {
            name: 'Ikenna Iwuoha',
            title: 'Full-Stack Technologist & Digital Solutions Architect',
            tagline: 'From Infrastructure to AI—Delivering Scalable, Secure, and Insightful Technology Solutions.',
            bio: '10+ years of experience delivering enterprise solutions across multiple industries.',
            resumeUrl: '/resume-ikenna-iwuoha.pdf',
            location: 'Ireland'
          },
          about: {
            summary: 'Experienced technology professional with a passion for innovation.',
            highlights: ['10+ years in technology', 'Cross-industry experience', 'Full-stack expertise']
          },
          skills: {
            "Software & Architecture": [
              "Python", "C#", "PHP", "JavaScript", "TypeScript", "ERPNext", "MySQL", "PostgreSQL", "Streamlit", "Web Development", "Mobile App Development", "API Design"
            ],
            "Systems & Infrastructure": [
              "Active Directory", "Office 365", "Exchange Server", "Networking", "Virtualization", "Hyper-V", "Windows Server", "Linux Administration"
            ],
            "Cloud & DevOps": [
              "Google Cloud Platform", "SaaS Solutions", "System Administration", "Docker", "CI/CD", "Infrastructure as Code", "Cloud Migration"
            ],
            "Project & Team Leadership": [
              "Agile Methodologies", "Scrum", "JIRA", "Requirement Analysis", "Technical Support", "Documentation", "Stakeholder Management", "Team Leadership"
            ],
            "Data & Analytics": [
              "Power BI", "SQL", "Data Analysis", "Dashboard Development", "Business Intelligence", "Reporting", "Data Visualization"
            ]
          },
          experience: [
            {
              title: "IT Manager",
              company: "Farrelly Motors",
              period: "2023 - Present",
              location: "Ireland",
              description: "Leading digital transformation initiatives and infrastructure modernization for automotive dealership operations.",
              achievements: [
                "Delivered custom workshop management system using C# and MySQL",
                "Implemented real-time analytics dashboards improving operational efficiency by 35%",
                "Managed infrastructure upgrades supporting 100+ users across multiple locations"
              ],
              technologies: ["C#", "MySQL", "Power BI", "Windows Server", "Active Directory"]
            }
          ],
          projects: [
            {
              title: "Workshop Management System",
              company: "Farrelly Motors",
              description: "Complete workshop management solution with real-time tracking, inventory management, and customer communications.",
              image: "https://images.pexels.com/photos/5474285/pexels-photo-5474285.jpeg?auto=compress&cs=tinysrgb&w=800",
              technologies: ["C#", "MySQL", "WPF", "Crystal Reports"],
              features: [
                "Real-time job tracking and status updates",
                "Integrated inventory management system",
                "Automated customer communication workflows",
                "Comprehensive reporting and analytics dashboard"
              ],
              impact: "Reduced job processing time by 40% and improved customer satisfaction scores by 25%"
            }
          ],
          education: [
            {
              degree: "Master's in Computer Science (MIS)",
              institution: "University",
              year: "2018",
              description: "Specialized in Management Information Systems with focus on enterprise architecture and data analytics."
            }
          ],
          certifications: [
            {
              name: "Goethe German Certificate",
              issuer: "Goethe Institute",
              year: "2020",
              description: "Advanced German language proficiency certification"
            }
          ],
          blog: [
            {
              title: "Why ERP Fails Without Proper Change Management",
              excerpt: "Exploring the critical success factors for ERP implementations beyond technical considerations.",
              date: "2024-01-15",
              readTime: "8 min read",
              image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400"
            }
          ],
          contact: {
            email: 'ikenna.b.iwuoha@gmail.com',
            linkedin: 'https://linkedin.com/in/ikenna-iwuoha',
            github: 'https://github.com/ikenna-iwuoha',
            location: 'Ireland',
            available: true
          }
        };
        setContent(fallbackContent);
        storage.saveContent(fallbackContent);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleContentSave = async (updatedContent: any) => {
    setContent(updatedContent);
    // Save to localStorage
    storage.saveContent(updatedContent);
    console.log('Content saved to localStorage:', updatedContent);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800">
        <LoadingSpinner size="xl" text="Loading portfolio..." />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">Failed to load portfolio content.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="relative">
      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* CMS Access Button */}
      <Button
        onClick={() => setShowCMS(true)}
        className="fixed top-4 right-4 z-40 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white shadow-lg"
        size="sm"
      >
        <Settings size={16} className="mr-2" />
        CMS
      </Button>

      {/* Main Content */}
      <Hero data={content.hero} contact={content.contact} />
      <About data={content.about} />
      <Skills data={content.skills} />
      <Experience data={content.experience} />
      <Projects data={content.projects} />
      <Education education={content.education} certifications={content.certifications} />
      <Blog data={content.blog} />
      <Contact data={content.contact} />
      <Footer />

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