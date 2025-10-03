'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { trackContactClick } from '@/lib/analytics';

interface ContactFormProps {
  email: string;
}

export default function ContactForm({ email }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Using Formspree for form handling
      const response = await fetch('https://formspree.io/f/xjkarjyj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _subject: `Portfolio Contact: ${formData.subject}`,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        trackContactClick('form');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailClick = () => {
    trackContactClick('email');
    window.open(`mailto:${email}?subject=Portfolio Inquiry`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Contact Form */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Send className="h-5 w-5" />
            Send Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
            </div>
            <Input
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
            />
            <Textarea
              placeholder="Quick Message"
              rows={5}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 resize-none"
            />
            
            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span>Message sent successfully!</span>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to send message. Please try again.</span>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Direct Contact */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="h-5 w-5" />
            Direct Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-gray-200">Email</h4>
            <Button 
              variant="outline" 
              onClick={handleEmailClick}
              className="w-full justify-start bg-white/10 border-white/20 text-blue-400 hover:bg-white/20 hover:text-blue-300 break-all"
            >
              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </Button>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 text-gray-200">Response Time</h4>
            <p className="text-sm text-gray-300 break-words">
              I typically respond within 24 hours during business days.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-gray-200">Availability</h4>
            <p className="text-sm text-gray-300 break-words">
              Currently available for new opportunities and collaborations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 