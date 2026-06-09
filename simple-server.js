const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const PUBLIC_DIR = 'd:/download/Test/backend/microservices/gateway/public';

const server = http.createServer((req, res) => {
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (_, data) => {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(data);
      });
    } else {
      const ext = path.extname(filePath);
      const contentType = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
      }[ext] || 'application/octet-stream';
      
      res.writeHead(200, {'Content-Type': contentType});
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});