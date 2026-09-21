const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'www.fontspace.com',
  path: '/ananda-black-font-f85089',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }
};

https.get(options, (res) => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    fs.writeFileSync('scratch_fontspace.html', html);
    console.log('Status:', res.statusCode, 'Length:', html.length);
  });
}).on('error', console.error);

