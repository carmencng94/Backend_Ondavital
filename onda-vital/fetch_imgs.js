const https = require('https');
https.get('https://www.ondavital.com/salas', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
    let match;
    const urls = [];
    while ((match = regex.exec(data)) !== null) {
      urls.push(match[1]);
    }
    console.log(urls.join('\n'));
    
    const bgRegex = /background-image:\s*url\(([^)]+)\)/gi;
    while ((match = bgRegex.exec(data)) !== null) {
      urls.push(match[1]);
    }
    console.log('--- Backgrounds ---');
    console.log(urls.join('\n'));
  });
});
