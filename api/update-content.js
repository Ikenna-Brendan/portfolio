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
    const contentPath = path.join(process.cwd(), 'public/data/content.json');
    
    // Ensure the directory exists
    const dir = path.dirname(contentPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the updated content
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
    
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
