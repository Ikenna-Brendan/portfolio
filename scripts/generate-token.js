// Generate a secure random token for content updates
const crypto = require('crypto');

// Generate a 64-byte random token
const token = crypto.randomBytes(32).toString('hex');

console.log('Generated secure token for content updates:'); 
console.log('NEXT_PUBLIC_CONTENT_UPDATE_TOKEN=' + token);
console.log('CONTENT_UPDATE_TOKEN=' + token);

console.log('\nAdd these to your .env.local file (make sure to keep it secret!)');
