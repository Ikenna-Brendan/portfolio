// Storage utility for GitHub Pages compatibility
// Uses localStorage and sessionStorage for data persistence

export interface StorageData {
  content: any;
  lastUpdated: string;
  version: string;
  buildId?: string;
}

const STORAGE_KEY = 'portfolio-content';
const VERSION = '1.0.5'; // Bump version to force cache invalidation

// Get build ID from URL, build-info.json, or use default
const getBuildId = (): string => {
  if (typeof window === 'undefined') {
    console.log('getBuildId: Running on server, returning "local"');
    return 'local';
  }
  
  // In development, always use 'dev' build ID
  if (process.env.NODE_ENV === 'development') {
    console.log('getBuildId: In development, using "dev" build ID');
    return 'dev';
  }
  
  // In production, try to get from URL first
  const urlParams = new URLSearchParams(window.location.search);
  const urlBuildId = urlParams.get('v');
  if (urlBuildId) {
    console.log('getBuildId: Using build ID from URL:', urlBuildId);
    return urlBuildId;
  }
  
  // Try to get build ID from build-info.json
  try {
    // This will be available in the built version
    const buildInfo = (window as any).__BUILD_INFO__;
    if (buildInfo && buildInfo.buildId) {
      console.log('getBuildId: Using build ID from build-info.json:', buildInfo.buildId);
      return buildInfo.buildId;
    }
  } catch (error) {
    console.log('Failed to load build info:', error);
  }
  
  // Fallback to a build ID based on the current date
  const date = new Date();
  const dateString = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  console.log('getBuildId: Using date-based build ID');
  return `build-${dateString}`;
};

const CURRENT_BUILD_ID = getBuildId();

export const storage = {
  // Save content to localStorage with build ID
  saveContent: (content: any): void => {
    try {
      console.log('Saving content to localStorage...', { content });
      const data: StorageData = {
        content,
        lastUpdated: new Date().toISOString(),
        version: VERSION,
        buildId: CURRENT_BUILD_ID
      };
      console.log('Data to be saved:', data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log(`Content saved to localStorage [Build: ${CURRENT_BUILD_ID}, Key: ${STORAGE_KEY}]`);
      
      // Verify the content was saved
      const saved = localStorage.getItem(STORAGE_KEY);
      console.log('Verification - Content in localStorage:', saved);
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  },

  // Load content from localStorage with build ID check
  loadContent: (): any | null => {
    try {
      console.log('Attempting to load content from localStorage...');
      
      // First, check if we should force a refresh from the server
      const lastRefresh = localStorage.getItem(`${STORAGE_KEY}_last_refresh`);
      const now = Date.now();
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      
      // Force refresh if it's been more than 1 hour since last refresh
      if (lastRefresh && (now - parseInt(lastRefresh, 10)) > oneHour) {
        console.log('Forcing content refresh - last refresh was more than 1 hour ago');
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(`${STORAGE_KEY}_last_refresh`, now.toString());
        return null;
      }
      
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (!stored) {
        console.log('No stored content found in localStorage');
        return null;
      }
      
      const data: StorageData = JSON.parse(stored);
      console.log('Loaded content from localStorage:', {
        lastUpdated: data.lastUpdated,
        version: data.version,
        buildId: data.buildId || 'legacy',
        contentKeys: Object.keys(data.content || {})
      });
      
      // Skip build ID check in development
      if (process.env.NODE_ENV !== 'development') {
        // Check if data is from a different build
        if (data.buildId && data.buildId !== CURRENT_BUILD_ID) {
          console.log(`Build ID changed (${data.buildId} -> ${CURRENT_BUILD_ID}), clearing cache`);
          localStorage.removeItem(STORAGE_KEY);
          return null;
        }
        
        // Check if data is from a newer version
        if (data.version !== VERSION) {
          console.warn('Storage version mismatch, clearing old data');
          localStorage.removeItem(STORAGE_KEY);
          return null;
        }
      }
      
      // Update the last refresh time
      localStorage.setItem(`${STORAGE_KEY}_last_refresh`, now.toString());
      
      console.log(`Successfully loaded content from localStorage [Build: ${data.buildId || 'legacy'}, Last Updated: ${data.lastUpdated}]`);
      return data.content;
    } catch (error) {
      console.error('Failed to load content from storage:', error);
      return null;
    }
  },

  // Clear stored content
  clearContent: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Content cleared from localStorage');
  },

  // Check if content exists
  hasContent: (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  // Get last updated timestamp
  getLastUpdated: (): string | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const data: StorageData = JSON.parse(stored);
      return data.lastUpdated;
    } catch {
      return null;
    }
  }
}; 