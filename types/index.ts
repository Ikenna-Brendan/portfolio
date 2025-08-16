export interface HeroContent {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  resumeUrl: string;
  location: string;
}

export interface AboutContent {
  summary: string;
  highlights: string[];
}

export interface ContactContent {
  email: string;
  linkedin: string;
  github: string;
  location: string;
  available: boolean;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date?: string;
  year?: string;
  description?: string;
  url?: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface ProjectItem {
  title: string;
  company?: string;
  description: string;
  image?: string;
  technologies: string[];
  features?: string[];
  impact?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  description: string;
}

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  image?: string;
  content?: string;
}

export interface Content {
  hero: HeroContent;
  about: AboutContent;
  skills: Record<string, string[]>;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  blog: BlogPost[];
  contact: ContactContent;
  certifications?: CertificationItem[];
  _lastUpdated?: string;
}
