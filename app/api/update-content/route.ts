import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This route cannot be statically exported
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Not allowed in production' },
      { status: 403 }
    );
  }

  try {
    const content = await request.json();
    const publicPath = path.join(process.cwd(), 'public/data/content.json');
    const docsPath = path.join(process.cwd(), 'docs/data/content.json');
    
    // Ensure the directories exist
    const publicDir = path.dirname(publicPath);
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    const docsDir = path.dirname(docsPath);
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    
    // Write the updated content to both
    const payload = JSON.stringify(content, null, 2);
    fs.writeFileSync(publicPath, payload, 'utf8');
    fs.writeFileSync(docsPath, payload, 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    );
  }
}
