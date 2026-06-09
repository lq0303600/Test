/**
 * 用户服务微服务入口
 * 端口: 3001
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const config = require('./config/app');
const logger = require('./utils/logger');
const userRoutes = require('./routes/userRoutes');
const UserModel = require('./models/userModel');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    service: 'user-service',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 路由
app.use('/api/users', userRoutes);

// 错误处理
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    timestamp: new Date().toISOString()
  });
});

// 启动服务
async function startServer() {
  try {
    app.listen(config.port, () => {
      logger.info(`用户服务已启动，端口: ${config.port}`);
    });
  } catch (error) {
    logger.error('启动失败:', error);
    process.exit(1);
  }
}

startServer();
