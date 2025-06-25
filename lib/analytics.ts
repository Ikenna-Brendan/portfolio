// Analytics utility for tracking user interactions

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // In production, this would send to your analytics service
  // For now, we'll just log to console
  console.log('Analytics Event:', eventName, properties);
  
  // Example: Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
};

export const trackPageView = (page: string) => {
  trackEvent('page_view', { page });
};

export const trackContactClick = (method: string) => {
  trackEvent('contact_click', { method });
};

export const trackProjectView = (projectTitle: string) => {
  trackEvent('project_view', { project_title: projectTitle });
};

export const trackResumeDownload = () => {
  trackEvent('resume_download');
};

export const trackCMSAccess = () => {
  trackEvent('cms_access');
}; 