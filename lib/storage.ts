// Storage utility for GitHub Pages compatibility
// Uses localStorage and sessionStorage for data persistence

export interface StorageData {
  content: any;
  lastUpdated: string;
  version: string;
}

const STORAGE_KEY = 'portfolio-content';
const VERSION = '1.0.2';

export const storage = {
  // Save content to localStorage
  saveContent: (content: any): void => {
    try {
      const data: StorageData = {
        content,
        lastUpdated: new Date().toISOString(),
        version: VERSION
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Content saved to localStorage');
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  },

  // Load content from localStorage
  loadContent: (): any | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const data: StorageData = JSON.parse(stored);
      
      // Check if data is from a newer version
      if (data.version !== VERSION) {
        console.warn('Storage version mismatch, clearing old data');
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
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