// This script exports the localStorage content to a JSON file
const fs = require('fs');
const path = require('path');

// This script is meant to be run in the browser context
// It will be injected into a page by the export-content.js script
const browserScript = `
  (function() {
    const content = localStorage.getItem('portfolio-content');
    if (content) {
      try {
        const data = JSON.parse(content);
        // Create a hidden element to trigger download
        const a = document.createElement('a');
        a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data.content, null, 2));
        a.download = 'content-export.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log('Content exported successfully');
      } catch (e) {
        console.error('Error exporting content:', e);
      }
    } else {
      console.log('No content found in localStorage');
    }
  })();
`;

// Write the browser script to a file
fs.writeFileSync(
  path.join(__dirname, '../public/export-browser.js'),
  browserScript,
  'utf8'
);

console.log('Browser export script created at public/export-browser.js');
