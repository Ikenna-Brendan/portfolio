'use client';

import { Calendar, Clock, ArrowRight, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  content?: string;
}

interface BlogProps {
  data: BlogPost[];
}

export default function Blog({ data }: BlogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
    setOpen(true);
  };

  return (
    <section id="blog" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Insights & Thoughts
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Sharing insights on technology leadership, software engineering, 
              and digital transformation strategies.
            </p>
          </div>

          {/* Blog posts grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((post, index) => (
              <Card 
                key={index}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                onClick={() => handleReadMore(post)}
              >
                {/* Post image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                      <Clock size={12} />
                      {post.readTime}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:translate-x-1 transition-all duration-300"
                    onClick={e => { e.stopPropagation(); handleReadMore(post); }}
                  >
                    Read More
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Blog Post Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl w-full">
              {selectedPost && (
                <>
                  <DialogHeader className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => setOpen(false)}
                    >
                      <X size={16} />
                      <span className="sr-only">Close</span>
                    </Button>
                    <DialogTitle>{selectedPost.title}</DialogTitle>
                    <DialogDescription>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Calendar size={14} />
                        <span>{new Date(selectedPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <Badge variant="outline" className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 ml-2">
                          <Clock size={12} />
                          {selectedPost.readTime}
                        </Badge>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-56 object-cover rounded mb-4" />
                  <div className="prose dark:prose-invert max-h-[70vh] overflow-y-auto [&>*]:mb-4 [&>*:last-child]:mb-0 pb-16">
                    <ReactMarkdown>{selectedPost.content || selectedPost.excerpt}</ReactMarkdown>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Call to action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Stay Updated
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Get notified when I publish new insights on technology trends, 
                project management strategies, and software engineering best practices.
              </p>
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium"
              >
                Subscribe to Updates
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}