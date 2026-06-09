/**
 * 消息交互服务微服务入口
 * 端口: 3005
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const config = require('./config/app');
const messageRoutes = require('./routes/messageRoutes');
const MessageModel = require('./models/messageModel');

const app = express();

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ service: 'message-service', status: 'ok' });
});

// 路由
app.use('/api/messages', messageRoutes);

// 启动
async function start() {
  try {
    await MessageModel.createTable();
    app.listen(config.port, () => {
      console.log(`消息交互服务已启动，端口: ${config.port}`);
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
}

start();
