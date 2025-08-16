import fs from 'fs';
import path from 'path';

// Helper function to verify the auth token
function verifyAuthToken(authHeader) {
  if (!authHeader) return false;
  
  const token = authHeader.replace('Bearer ', '');
  const expectedToken = process.env.CONTENT_UPDATE_TOKEN;
  
  return token && expectedToken && token === expectedToken;
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // In production, require a valid auth token
  if (process.env.NODE_ENV === 'production') {
    const isAuthorized = verifyAuthToken(req.headers.authorization);
    if (!isAuthorized) {
      console.warn('Unauthorized content update attempt');
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized. A valid token is required for content updates in production.' 
      });
    }
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
