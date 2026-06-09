const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<h1>Hello World!</h1>');
});

server.listen(8080, () => {
  console.log('Server running on port 8080');
  
  // 测试自己的服务器
  const req = http.request({ port: 8080, path: '/' }, (res) => {
    console.log('Response status:', res.statusCode);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Response:', data);
      server.close();
    });
  });
  
  req.on('error', (e) => {
    console.error('Error:', e);
    server.close();
  });
  
  req.end();
});