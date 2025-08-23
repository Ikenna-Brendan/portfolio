const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Only run in development
if (process.env.NODE_ENV !== 'production') {
  const dev = true;
  const hostname = 'localhost';
  const port = process.env.PORT || 3000;
  
  const app = next({ dev, hostname, port, dir: __dirname });
  const handle = app.getRequestHandler();

  // Create a custom server to handle static file serving
  app.prepare().then(() => {
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;
      
      // Serve files from the public directory
      if (pathname.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, 'public', pathname);
        
        // Check if file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            console.error(`File not found: ${filePath}`);
            res.statusCode = 404;
            res.end('File not found');
            return;
          }
          
          // Set content type based on file extension
          const ext = path.extname(filePath).toLowerCase();
          const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.webp': 'image/webp',
            '.ico': 'image/x-icon',
            '.json': 'application/json',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.html': 'text/html',
            '.txt': 'text/plain',
          };
          
          const contentType = mimeTypes[ext] || 'application/octet-stream';
          
          // Set CORS headers for development
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Content-Type', contentType);
          
          // Stream the file
          const stream = fs.createReadStream(filePath);
          stream.on('error', (error) => {
            console.error(`Error reading file ${filePath}:`, error);
            res.statusCode = 500;
            res.end('Internal Server Error');
          });
          
          stream.pipe(res);
        });
      } else {
        // Handle Next.js pages and other routes
        handle(req, res, parsedUrl);
      }
    });
    
    // Start the server
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Serving static files from: ${path.join(__dirname, 'public')}`);
    });
  });
} else {
  console.error('This server is only intended for development use.');
  process.exit(1);
}
