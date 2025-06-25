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

  useEffect(() => {
    setContent(currentContent);
    setLastSaved(storage.getLastUpdated());
    if (isVisible) {
      trackCMSAccess();
    }
  }, [currentContent, isVisible]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      storage.saveContent(content);
      onSave(content);
      setLastSaved(new Date().toISOString());
      // Show success feedback
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

  const sections = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
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
            <Button variant="outline" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <div className="grid md:grid-cols-4 gap-6">
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
            <div className="md:col-span-3">
              {activeSection === 'hero' && renderHeroEditor()}
              {activeSection === 'about' && renderAboutEditor()}
              {activeSection === 'skills' && renderSkillsEditor()}
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
      </Card>
    </div>
  );
}