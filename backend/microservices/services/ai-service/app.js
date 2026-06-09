/**
 * AI智能问答服务微服务入口
 * 端口: 3004
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const config = require('./config/app');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    service: 'ai-service', 
    status: 'ok',
    apiConfigured: !!config.deepseekApiKey
  });
});

// 路由
app.use('/api/ai', aiRoutes);

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ code: 500, message: '服务器内部错误' });
});

// 启动
app.listen(config.port, () => {
  console.log(`AI智能问答服务已启动，端口: ${config.port}`);
  console.log(`DeepSeek API配置: ${config.deepseekApiKey ? '已配置' : '未配置'}`);
});
