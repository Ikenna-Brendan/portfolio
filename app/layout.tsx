import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { registerServiceWorker } from '@/lib/sw-register';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ikenna-brendan.github.io/portfolio'),
  title: 'Ikenna Iwuoha | Full-Stack Technologist & Digital Solutions Architect',
  description: 'From Infrastructure to AI—Delivering Scalable, Secure, and Insightful Technology Solutions. 10+ years of experience across automotive, healthcare, retail, and education sectors.',
  keywords: 'Full-Stack Developer, Digital Solutions Architect, Software Engineer, ERP Implementation, Cloud Solutions, Data Analytics, Technology Leadership',
  authors: [{ name: 'Ikenna Iwuoha' }],
  creator: 'Ikenna Iwuoha',
  publisher: 'Ikenna Iwuoha',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Ikenna Iwuoha | Full-Stack Technologist & Digital Solutions Architect',
    description: 'From Infrastructure to AI—Delivering Scalable, Secure, and Insightful Technology Solutions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ikenna Iwuoha Portfolio',
    images: [
      {
        url: '/portfolio/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ikenna Iwuoha - Full-Stack Technologist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ikenna Iwuoha | Full-Stack Technologist & Digital Solutions Architect',
    description: 'From Infrastructure to AI—Delivering Scalable, Secure, and Insightful Technology Solutions.',
    creator: '@ikenna_iwuoha',
    images: ['/portfolio/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/portfolio/favicon.ico',
    apple: '/portfolio/apple-touch-icon.png',
  },
  manifest: '/portfolio/manifest.json',
  themeColor: '#1e293b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Register service worker on client side
  if (typeof window !== 'undefined') {
    registerServiceWorker();
  }

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {/* Global toast notifications */}
            <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}