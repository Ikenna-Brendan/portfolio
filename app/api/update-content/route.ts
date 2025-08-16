import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Paths to update
const CONTENT_PATHS = [
  path.join(process.cwd(), 'public/data/content.json'),
  path.join(process.cwd(), 'docs/data/content.json')
];

// Update all content files
function updateContentFiles(content: any) {
  const timestamp = new Date().toISOString();
  const contentWithTimestamp = {
    ...content,
    _lastUpdated: timestamp
  };

  return CONTENT_PATHS.map(contentPath => {
    try {
      const dir = path.dirname(contentPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(contentPath, JSON.stringify(contentWithTimestamp, null, 2), 'utf8');
      return { path: contentPath, success: true };
    } catch (error) {
      console.error(`Error writing to ${contentPath}:`, error);
      return { path: contentPath, success: false, error: String(error) };
    }
  });
}

export async function POST(request: Request) {
  // Only allow in development or from authenticated sources in production
  if (process.env.NODE_ENV === 'production' && 
      request.headers.get('x-secure-token') !== process.env.CONTENT_UPDATE_TOKEN) {
    return NextResponse.json(
      { success: false, error: 'Not authorized' },
      { status: 403 }
    );
  }

  try {
    const content = await request.json();
    
    // Validate required fields
    if (!content.hero || !content.about) {
      return NextResponse.json(
        { success: false, error: 'Invalid content structure' },
        { status: 400 }
      );
    }

    // Update all content files
    const results = updateContentFiles(content);
    const allSuccessful = results.every(r => r.success);
    
    // Create backup of the main content file
    if (results[0]?.success) {
      try {
        const backupDir = path.join(process.cwd(), 'public/data/backups');
        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `content-${timestamp}.json`);
        fs.copyFileSync(CONTENT_PATHS[0], backupPath);
      } catch (backupError) {
        console.error('Error creating backup:', backupError);
      }
    }

    return NextResponse.json({
      success: allSuccessful,
      results: results.map(r => ({
        path: r.path,
        success: r.success,
        error: r.error
      }))
    });

  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update content',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
