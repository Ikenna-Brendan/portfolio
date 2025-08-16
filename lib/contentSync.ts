import { storage } from './storage';

export interface ContentUpdateResult {
  success: boolean;
  localStorage?: boolean;
  api?: boolean;
  error?: string;
  details?: any;
}

export class ContentSynchronizer {
  private static instance: ContentSynchronizer;
  private lastSyncTime: number = 0;
  private SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): ContentSynchronizer {
    if (!ContentSynchronizer.instance) {
      ContentSynchronizer.instance = new ContentSynchronizer();
    }
    return ContentSynchronizer.instance;
  }

  // Update content in localStorage and sync with the server
  public async updateContent(content: any): Promise<ContentUpdateResult> {
    const result: ContentUpdateResult = { success: true };

    try {
      // Update localStorage
      storage.saveContent(content);
      result.localStorage = true;

      // Only sync with server if enough time has passed since last sync
      const now = Date.now();
      if (now - this.lastSyncTime > this.SYNC_INTERVAL) {
        try {
          const headers: HeadersInit = {
            'Content-Type': 'application/json',
          };

          // Add auth token in production
          if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_CONTENT_UPDATE_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_CONTENT_UPDATE_TOKEN}`;
          }

          const response = await fetch('/api/update-content', {
            method: 'POST',
            headers,
            body: JSON.stringify(content),
          });

          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to update content on server');
          }

          result.api = true;
          this.lastSyncTime = now;
        } catch (error) {
          console.warn('Failed to sync with server, using local storage only:', error);
          result.api = false;
          result.error = 'Failed to sync with server';
          result.details = error instanceof Error ? error.message : String(error);
        }
      } else {
        console.log('Skipping server sync - too soon since last sync');
        result.api = false; // Not an error, just skipped
      }

      return result;
    } catch (error) {
      console.error('Error updating content:', error);
      return {
        success: false,
        error: 'Failed to update content',
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  // Get content, trying localStorage first, then falling back to API
  public async getContent(): Promise<any> {
    // Try localStorage first
    const localContent = storage.loadContent();
    if (localContent) {
      // Start a background sync if needed
      this.syncInBackground();
      return localContent;
    }

    // Fall back to API
    return this.syncFromServer();
  }

  // Force sync from server
  public async syncFromServer(): Promise<any> {
    try {
      const response = await fetch('/api/content');
      if (!response.ok) {
        throw new Error('Failed to fetch content from server');
      }
      
      const content = await response.json();
      storage.saveContent(content);
      this.lastSyncTime = Date.now();
      return content;
    } catch (error) {
      console.error('Error syncing from server:', error);
      throw error;
    }
  }

  // Background sync if enough time has passed
  private async syncInBackground(): Promise<void> {
    const now = Date.now();
    if (now - this.lastSyncTime > this.SYNC_INTERVAL) {
      try {
        await this.syncFromServer();
      } catch (error) {
        console.warn('Background sync failed:', error);
      }
    }
  }
}

export const contentSynchronizer = ContentSynchronizer.getInstance();
