'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Plus, Trash2, Download, Upload, RotateCcw } from 'lucide-react';
import { storage } from '@/lib/storage';
import { trackCMSAccess } from '@/lib/analytics';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';

interface ContentManagerProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (updatedContent: any) => void;
  currentContent: any;
}

export default function ContentManager({ isVisible, onClose, onSave, currentContent }: ContentManagerProps) {
  const [content, setContent] = useState(currentContent);
  const [activeSection, setActiveSection] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // CMS Password - Use environment variable or fallback to hardcoded password
  // Set NEXT_PUBLIC_CMS_PASSWORD in your environment or .env.local file
  const CMS_PASSWORD = process.env.NEXT_PUBLIC_CMS_PASSWORD || 'MyPortfolio2024!';

  useEffect(() => {
    setContent(currentContent);
    setLastSaved(storage.getLastUpdated());
    if (isVisible) {
      trackCMSAccess();
    }
  }, [currentContent, isVisible]);

  // Prevent body scroll when CMS is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  // Prevent scroll propagation on modal content
  const handleModalScroll = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CMS_PASSWORD) {
      setShowPasswordPrompt(false);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
      setPassword('');
    }
  };

  const handleClose = () => {
    setShowPasswordPrompt(true);
    setPassword('');
    setPasswordError('');
    onClose();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage and trigger file download in development
      await storage.saveContent(content, { saveToFile: true });
      onSave(content);
      setLastSaved(new Date().toISOString());
      // Show success feedback
      toast.success('Content saved successfully!');
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error('Failed to save content:', error);
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-content.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedContent = JSON.parse(e.target?.result as string);
        setContent(importedContent);
        storage.saveContent(importedContent);
        onSave(importedContent);
      } catch (error) {
        console.error('Failed to import content:', error);
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default content? This cannot be undone.')) {
      storage.clearContent();
      window.location.reload();
    }
  };

  const updateContent = (section: string, field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateArrayItem = (section: string, index: number, field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: prev[section].map((item: any, i: number) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section: string, newItem: any) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeArrayItem = (section: string, index: number) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: prev[section].filter((_: any, i: number) => i !== index)
    }));
  };

  const renderHeroEditor = () => (
    <div className="space-y-4">
      <Input
        placeholder="Name"
        value={content.hero.name}
        onChange={(e) => updateContent('hero', 'name', e.target.value)}
      />
      <Input
        placeholder="Title"
        value={content.hero.title}
        onChange={(e) => updateContent('hero', 'title', e.target.value)}
      />
      <Textarea
        placeholder="Tagline"
        value={content.hero.tagline}
        onChange={(e) => updateContent('hero', 'tagline', e.target.value)}
      />
      <Textarea
        placeholder="Bio"
        value={content.hero.bio}
        onChange={(e) => updateContent('hero', 'bio', e.target.value)}
      />
      <Input
        placeholder="Location"
        value={content.hero.location}
        onChange={(e) => updateContent('hero', 'location', e.target.value)}
      />
      <Input
        placeholder="Resume URL"
        value={content.hero.resumeUrl}
        onChange={(e) => updateContent('hero', 'resumeUrl', e.target.value)}
      />
    </div>
  );

  const renderAboutEditor = () => (
    <div className="space-y-4">
      <Textarea
        placeholder="Summary"
        rows={5}
        value={content.about.summary}
        onChange={(e) => updateContent('about', 'summary', e.target.value)}
      />
      <div>
        <h4 className="font-semibold mb-2">Highlights</h4>
        {content.about.highlights.map((highlight: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              value={highlight}
              onChange={(e) => {
                const newHighlights = [...content.about.highlights];
                newHighlights[index] = e.target.value;
                updateContent('about', 'highlights', newHighlights);
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newHighlights = content.about.highlights.filter((_: any, i: number) => i !== index);
                updateContent('about', 'highlights', newHighlights);
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newHighlights = [...content.about.highlights, ''];
            updateContent('about', 'highlights', newHighlights);
          }}
        >
          <Plus size={16} className="mr-2" />
          Add Highlight
        </Button>
      </div>
    </div>
  );

  const renderSkillsEditor = () => (
    <div className="space-y-4">
      {Object.entries(content.skills).map(([category, skills]: [string, any]) => (
        <div key={category} className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Category name"
              value={category}
              onChange={(e) => {
                const newSkills = { ...content.skills };
                delete newSkills[category];
                newSkills[e.target.value] = skills;
                setContent((prev: any) => ({ ...prev, skills: newSkills }));
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newSkills = { ...content.skills };
                delete newSkills[category];
                setContent((prev: any) => ({ ...prev, skills: newSkills }));
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="cursor-pointer">
                {skill}
                <X
                  size={12}
                  className="ml-1 cursor-pointer"
                  onClick={() => {
                    const newSkills = [...skills];
                    newSkills.splice(index, 1);
                    setContent((prev: any) => ({
                      ...prev,
                      skills: { ...prev.skills, [category]: newSkills }
                    }));
                  }}
                />
              </Badge>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const skillName = prompt('Enter skill name:');
                if (skillName) {
                  const newSkills = [...skills, skillName];
                  setContent((prev: any) => ({
                    ...prev,
                    skills: { ...prev.skills, [category]: newSkills }
                  }));
                }
              }}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          const categoryName = prompt('Enter category name:');
          if (categoryName) {
            setContent((prev: any) => ({
              ...prev,
              skills: { ...prev.skills, [categoryName]: [] }
            }));
          }
        }}
      >
        <Plus size={16} className="mr-2" />
        Add Category
      </Button>
    </div>
  );

  const renderExperienceEditor = () => (
    <div className="space-y-6">
      {content.experience.map((exp: any, index: number) => (
        <Card key={index} className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Job Title"
                value={exp.title}
                onChange={(e) => updateArrayItem('experience', index, 'title', e.target.value)}
              />
              <Input
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Period (e.g., 2023 - Present)"
                value={exp.period}
                onChange={(e) => updateArrayItem('experience', index, 'period', e.target.value)}
              />
              <Input
                placeholder="Location"
                value={exp.location}
                onChange={(e) => updateArrayItem('experience', index, 'location', e.target.value)}
              />
            </div>
            <Textarea
              placeholder="Description"
              value={exp.description}
              onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)}
            />
            <div>
              <h4 className="font-semibold mb-2">Achievements</h4>
              {exp.achievements.map((achievement: string, aIndex: number) => (
                <div key={aIndex} className="flex gap-2 mb-2">
                  <Input
                    value={achievement}
                    onChange={(e) => {
                      const newAchievements = [...exp.achievements];
                      newAchievements[aIndex] = e.target.value;
                      updateArrayItem('experience', index, 'achievements', newAchievements);
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newAchievements = exp.achievements.filter((_: any, i: number) => i !== aIndex);
                      updateArrayItem('experience', index, 'achievements', newAchievements);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newAchievements = [...exp.achievements, ''];
                  updateArrayItem('experience', index, 'achievements', newAchievements);
                }}
              >
                <Plus size={16} className="mr-2" />
                Add Achievement
              </Button>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech: string, tIndex: number) => (
                  <Badge key={tIndex} variant="secondary" className="cursor-pointer">
                    {tech}
                    <X
                      size={12}
                      className="ml-1 cursor-pointer"
                      onClick={() => {
                        const newTechs = exp.technologies.filter((_: any, i: number) => i !== tIndex);
                        updateArrayItem('experience', index, 'technologies', newTechs);
                      }}
                    />
                  </Badge>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const techName = prompt('Enter technology name:');
                    if (techName) {
                      const newTechs = [...exp.technologies, techName];
                      updateArrayItem('experience', index, 'technologies', newTechs);
                    }
                  }}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeArrayItem('experience', index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              Remove Experience
            </Button>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          const newExperience = {
            title: '',
            company: '',
            period: '',
            location: '',
            description: '',
            achievements: [''],
            technologies: []
          };
          addArrayItem('experience', newExperience);
        }}
      >
        <Plus size={16} className="mr-2" />
        Add Experience
      </Button>
    </div>
  );

  const renderProjectsEditor = () => (
    <div className="space-y-6">
      {content.projects.map((project: any, index: number) => (
        <Card key={index} className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Project Title"
                value={project.title}
                onChange={(e) => updateArrayItem('projects', index, 'title', e.target.value)}
              />
              <Input
                placeholder="Company"
                value={project.company}
                onChange={(e) => updateArrayItem('projects', index, 'company', e.target.value)}
              />
            </div>
            <Textarea
              placeholder="Description"
              value={project.description}
              onChange={(e) => updateArrayItem('projects', index, 'description', e.target.value)}
            />
            <Input
              placeholder="Image URL"
              value={project.image}
              onChange={(e) => updateArrayItem('projects', index, 'image', e.target.value)}
            />
            <div>
              <h4 className="font-semibold mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string, tIndex: number) => (
                  <Badge key={tIndex} variant="secondary" className="cursor-pointer">
                    {tech}
                    <X
                      size={12}
                      className="ml-1 cursor-pointer"
                      onClick={() => {
                        const newTechs = project.technologies.filter((_: any, i: number) => i !== tIndex);
                        updateArrayItem('projects', index, 'technologies', newTechs);
                      }}
                    />
                  </Badge>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const techName = prompt('Enter technology name:');
                    if (techName) {
                      const newTechs = [...project.technologies, techName];
                      updateArrayItem('projects', index, 'technologies', newTechs);
                    }
                  }}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              {project.features.map((feature: string, fIndex: number) => (
                <div key={fIndex} className="flex gap-2 mb-2">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...project.features];
                      newFeatures[fIndex] = e.target.value;
                      updateArrayItem('projects', index, 'features', newFeatures);
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newFeatures = project.features.filter((_: any, i: number) => i !== fIndex);
                      updateArrayItem('projects', index, 'features', newFeatures);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newFeatures = [...project.features, ''];
                  updateArrayItem('projects', index, 'features', newFeatures);
                }}
              >
                <Plus size={16} className="mr-2" />
                Add Feature
              </Button>
            </div>
            <Input
              placeholder="Impact"
              value={project.impact}
              onChange={(e) => updateArrayItem('projects', index, 'impact', e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeArrayItem('projects', index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              Remove Project
            </Button>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          const newProject = {
            title: '',
            company: '',
            description: '',
            image: '',
            technologies: [],
            features: [''],
            impact: ''
          };
          addArrayItem('projects', newProject);
        }}
      >
        <Plus size={16} className="mr-2" />
        Add Project
      </Button>
    </div>
  );

  const renderEducationEditor = () => (
    <div className="space-y-6">
      {content.education.map((edu: any, index: number) => (
        <Card key={index} className="p-4">
          <div className="space-y-4">
            <Input
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)}
            />
            <Input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => updateArrayItem('education', index, 'institution', e.target.value)}
            />
            <Input
              placeholder="Year"
              value={edu.year}
              onChange={(e) => updateArrayItem('education', index, 'year', e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={edu.description}
              onChange={(e) => updateArrayItem('education', index, 'description', e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeArrayItem('education', index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              Remove Education
            </Button>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          const newEducation = {
            degree: '',
            institution: '',
            year: '',
            description: ''
          };
          addArrayItem('education', newEducation);
        }}
      >
        <Plus size={16} className="mr-2" />
        Add Education
      </Button>
    </div>
  );

  const renderCertificationsEditor = () => (
    <div className="space-y-6">
      {content.certifications.map((cert: any, index: number) => (
        <Card key={index} className="p-4">
          <div className="space-y-4">
            <Input
              placeholder="Certification Name"
              value={cert.name}
              onChange={(e) => updateArrayItem('certifications', index, 'name', e.target.value)}
            />
            <Input
              placeholder="Issuer"
              value={cert.issuer}
              onChange={(e) => updateArrayItem('certifications', index, 'issuer', e.target.value)}
            />
            <Input
              placeholder="Year"
              value={cert.year}
              onChange={(e) => updateArrayItem('certifications', index, 'year', e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={cert.description}
              onChange={(e) => updateArrayItem('certifications', index, 'description', e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeArrayItem('certifications', index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              Remove Certification
            </Button>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          const newCertification = {
            name: '',
            issuer: '',
            year: '',
            description: ''
          };
          addArrayItem('certifications', newCertification);
        }}
      >
        <Plus size={16} className="mr-2" />
        Add Certification
      </Button>
    </div>
  );

  const renderBlogEditor = () => (
    <div className="space-y-6">
      {content.blog.map((post: any, index: number) => (
        <Card key={index} className="p-4">
          <div className="space-y-4">
            <Input
              placeholder="Blog Title"
              value={post.title}
              onChange={(e) => updateArrayItem('blog', index, 'title', e.target.value)}
            />
            <Textarea
              placeholder="Excerpt"
              value={post.excerpt}
              onChange={(e) => updateArrayItem('blog', index, 'excerpt', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Date (YYYY-MM-DD)"
                value={post.date}
                onChange={(e) => updateArrayItem('blog', index, 'date', e.target.value)}
              />
              <Input
                placeholder="Read Time (e.g., 8 min read)"
                value={post.readTime}
                onChange={(e) => updateArrayItem('blog', index, 'readTime', e.target.value)}
              />
            </div>
            <Input
              placeholder="Image URL"
              value={post.image}
              onChange={(e) => updateArrayItem('blog', index, 'image', e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeArrayItem('blog', index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              Remove Blog Post
            </Button>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          const newBlogPost = {
            title: '',
            excerpt: '',
            date: '',
            readTime: '',
            image: ''
          };
          addArrayItem('blog', newBlogPost);
        }}
      >
        <Plus size={16} className="mr-2" />
        Add Blog Post
      </Button>
    </div>
  );

  const sections = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' }
  ];

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0 cms-modal-content">
        <DialogHeader className="flex-shrink-0 p-6 pb-4">
          <DialogTitle>Content Management System</DialogTitle>
          <DialogDescription>
            Edit your portfolio content. Changes are saved to localStorage.
          </DialogDescription>
        </DialogHeader>

        {showPasswordPrompt ? (
          <div className="flex flex-col items-center justify-center py-8 px-6">
            <div className="w-full max-w-md space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">CMS Access Required</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the password to access the content management system.
                </p>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter CMS password"
                    className={passwordError ? 'border-red-500' : ''}
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full">
                  Access CMS
                </Button>
              </form>
              
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full min-h-0">
            <CardHeader className="flex flex-row items-center justify-between flex-shrink-0 p-6 pb-4">
              <div>
                <CardTitle>Content Management System</CardTitle>
                {lastSaved && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last saved: {new Date(lastSaved).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload size={16} className="mr-2" />
                      Import
                    </span>
                  </Button>
                </label>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw size={16} className="mr-2" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={handleClose}>
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 pt-0 min-h-0" onScroll={handleModalScroll}>
              <div className="grid md:grid-cols-4 gap-6 h-full">
                {/* Section navigation */}
                <div className="space-y-2">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveSection(section.id)}
                      className="w-full justify-start"
                    >
                      {section.label}
                    </Button>
                  ))}
                </div>

                {/* Content editor */}
                <div className="md:col-span-3 overflow-y-auto" onScroll={handleModalScroll}>
                  {activeSection === 'hero' && renderHeroEditor()}
                  {activeSection === 'about' && renderAboutEditor()}
                  {activeSection === 'skills' && renderSkillsEditor()}
                  {activeSection === 'experience' && renderExperienceEditor()}
                  {activeSection === 'projects' && renderProjectsEditor()}
                  {activeSection === 'education' && renderEducationEditor()}
                  {activeSection === 'certifications' && renderCertificationsEditor()}
                  {activeSection === 'blog' && renderBlogEditor()}
                  {activeSection === 'contact' && (
                    <div className="space-y-4">
                      <Input
                        placeholder="Email"
                        value={content.contact.email}
                        onChange={(e) => updateContent('contact', 'email', e.target.value)}
                      />
                      <Input
                        placeholder="LinkedIn URL"
                        value={content.contact.linkedin}
                        onChange={(e) => updateContent('contact', 'linkedin', e.target.value)}
                      />
                      <Input
                        placeholder="GitHub URL"
                        value={content.contact.github}
                        onChange={(e) => updateContent('contact', 'github', e.target.value)}
                      />
                      <Input
                        placeholder="Location"
                        value={content.contact.location}
                        onChange={(e) => updateContent('contact', 'location', e.target.value)}
                      />
                    </div>
                  )}

                  {/* Save button */}
                  <div className="mt-6 pt-4 border-t">
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="w-full"
                    >
                      <Save size={16} className="mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}