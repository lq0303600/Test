const http = require('http');

// 模拟后端服务
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// AI问答接口
app.post('/api/qa/ask', (req, res) => {
  const question = req.body.question || '';
  console.log('Received question:', question);
  
  // 模拟AI回答
  const answer = `你问的是: "${question}"\n\n这是一个很好的问题！我可以帮你解答各种校园相关的问题。\n\n由于API已续费，现在可以使用DeepSeek AI进行智能问答了！`;
  
  res.json({
    code: 0,
    message: 'success',
    data: {
      answer: answer,
      confidence: 0.85,
      intent: { type: '咨询', confidence: 0.7 },
      category: 'campus'
    }
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器
const server = app.listen(3001, '0.0.0.0', () => {
  console.log('Server running on http://localhost:3001');
  
  // 启动后立即测试
  setTimeout(() => {
    const postData = JSON.stringify({ question: '你好，图书馆几点开门？' });
    
    const options = {
      hostname: '127.0.0.1',
      port: 3001,
      path: '/api/qa/ask',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      console.log('API Test Status:', res.statusCode);
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('API Response:', data);
      });
    });
    
    req.on('error', (e) => console.error('API Test Error:', e.message));
    req.write(postData);
    req.end();
  }, 1000);
});

// 保持运行
setInterval(() => {}, 60000);