// Client-side file system operations for development mode only

let isDownloading = false;

export const saveContentToFile = async (content: any): Promise<boolean> => {
  // Only run in development
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return false;
  }

  // Prevent multiple simultaneous downloads
  if (isDownloading) return false;
  isDownloading = true;

  try {
    // This will only work in a browser environment
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary download link and trigger it
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-latest.json'; // Changed name to be more specific
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      isDownloading = false;
    }, 100);
    
    console.log('Content saved as content-latest.json (development only)');
    return true;
  } catch (error) {
    console.error('Error saving content:', error);
    isDownloading = false;
    return false;
  }
};
