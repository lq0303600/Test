/**
 * 知识库服务微服务入口
 * 端口: 3002
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const config = require('./config/app');
const knowledgeRoutes = require('./routes/knowledgeRoutes');
const KnowledgeModel = require('./models/knowledgeModel');

const app = express();

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ service: 'knowledge-service', status: 'ok' });
});

// 路由
app.use('/api/knowledge', knowledgeRoutes);

// 启动
async function start() {
  try {
    await KnowledgeModel.createTable();
    app.listen(config.port, () => {
      console.log(`知识库服务已启动，端口: ${config.port}`);
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
}

start();
