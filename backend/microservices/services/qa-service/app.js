/**
 * 问答发布服务微服务入口
 * 端口: 3003
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const config = require('./config/app');
const questionRoutes = require('./routes/questionRoutes');
const QuestionModel = require('./models/questionModel');

const app = express();

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ service: 'qa-service', status: 'ok' });
});

// 路由
app.use('/api/questions', questionRoutes);

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ code: 500, message: '服务器内部错误' });
});

// 启动
async function start() {
  try {
    await QuestionModel.createTable();
    app.listen(config.port, () => {
      console.log(`问答发布服务已启动，端口: ${config.port}`);
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
}

start();
