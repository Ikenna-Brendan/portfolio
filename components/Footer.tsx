'use client';

import { ArrowUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            {/* Back to top button */}
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="mb-8 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <ArrowUp size={16} className="mr-2" />
              Back to Top
            </Button>

            {/* Footer content */}
            <div className="border-t border-gray-700 pt-8">
              <p className="text-gray-400">
                © 2024 Ikenna Iwuoha. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}