import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ success: false, error: 'Not allowed in production' });
  }

  try {
    const content = req.body;
    const publicContentPath = path.join(process.cwd(), 'public/data/content.json');
    const docsContentPath = path.join(process.cwd(), 'docs/data/content.json');
    
    // Ensure the directories exist
    const publicDir = path.dirname(publicContentPath);
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    const docsDir = path.dirname(docsContentPath);
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    
    // Write the updated content to both locations
    const payload = JSON.stringify(content, null, 2);
    fs.writeFileSync(publicContentPath, payload, 'utf8');
    fs.writeFileSync(docsContentPath, payload, 'utf8');
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating content:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update content',
      details: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set size limit for the request body
    },
  },
};
