'use client';

import { Mail, LinkedinIcon, GithubIcon, MapPin, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ContactForm from '@/components/ContactForm';
import { trackContactClick } from '@/lib/analytics';

interface ContactData {
  email: string;
  linkedin: string;
  github: string;
  location: string;
  available: boolean;
}

interface ContactProps {
  data: ContactData;
}

export default function Contact({ data }: ContactProps) {
  const handleEmailClick = () => {
    trackContactClick('email');
    window.open(`mailto:${data.email}?subject=Portfolio Inquiry`, '_blank');
  };

  const handleLinkedInClick = () => {
    trackContactClick('linkedin');
    window.open(data.linkedin, '_blank');
  };

  const handleGithubClick = () => {
    trackContactClick('github');
    window.open(data.github, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-slate-800 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let's Work Together
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-400 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Ready to transform your business with innovative technology solutions? 
              Let's discuss how we can collaborate to achieve your goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact information */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-200">Email</h4>
                    <Button 
                      variant="link" 
                      onClick={handleEmailClick}
                      className="text-blue-400 hover:text-blue-300 p-0 h-auto text-left break-all"
                    >
                      {data.email}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-200">Location</h4>
                    <p className="text-gray-300 break-words">{data.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-200">Availability</h4>
                    <p className="text-gray-300 break-words">
                      {data.available ? 'Available for new projects' : 'Currently unavailable'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div>
                <h4 className="font-semibold text-gray-200 mb-4">Connect With Me</h4>
                <div className="flex gap-4">
                  <Button
                    onClick={handleLinkedInClick}
                    size="lg"
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 p-0"
                  >
                    <LinkedinIcon size={20} />
                  </Button>
                  <Button
                    onClick={handleGithubClick}
                    size="lg"
                    className="w-12 h-12 bg-gray-700 hover:bg-gray-600 p-0"
                  >
                    <GithubIcon size={20} />
                  </Button>
                </div>
              </div>

              {/* Additional info */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-gray-200 mb-3">What I Offer</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="break-words">• Full-stack development solutions</li>
                    <li className="break-words">• ERP system implementations</li>
                    <li className="break-words">• Cloud infrastructure consulting</li>
                    <li className="break-words">• Data analytics and reporting</li>
                    <li className="break-words">• Technical leadership and mentoring</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact form */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 h-fit">
              <ContactForm email={data.email} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}