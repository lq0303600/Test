/**
 * 校园智能咨询问答平台 - Express入口文件
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config/app');
const { USE_MOCK_DB } = require('./database/adapter');
const logger = require('./utils/logger');

// 导入路由
const userRoutes = require('./routes/userRoutes');
const qaRoutes = require('./routes/qaRoutes');
const knowledgeRoutes = require('./routes/knowledgeRoutes');
const aiRoutes = require('./routes/aiRoutes');

// 创建Express应用
const app = express();

// 中间件配置
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb', type: 'application/json; charset=utf-8' }));
app.use(bodyParser.urlencoded({ extended: true, charset: 'utf-8' }));
app.use(express.json({ limit: '10mb' }));

// 处理OPTIONS预检请求
app.options('*', cors());

// 静态文件服务
app.use(express.static('public'));

// 路由配置
app.use('/api/users', userRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/ai', aiRoutes);

// 根路径欢迎页面
app.get('/', (req, res) => {
  res.json({
    name: '校园智能咨询问答平台 API',
    version: '1.0.0',
    description: '基于Express.js + DeepSeek AI的智能问答系统',
    endpoints: {
      users: {
        'POST /api/users/register': '用户注册',
        'POST /api/users/login': '用户登录',
        'GET /api/users/me': '获取当前用户信息',
        'PUT /api/users/me': '更新用户信息'
      },
      qa: {
        'POST /api/qa/ask': '提交问题并获取AI回答',
        'GET /api/qa/history': '获取问答历史',
        'GET /api/qa/questions/:id': '获取问题详情',
        'GET /api/qa/messages': '获取消息列表'
      },
      knowledge: {
        'GET /api/knowledge/list': '获取知识库列表',
        'GET /api/knowledge/:id': '获取知识库详情',
        'POST /api/knowledge': '创建知识库(管理员)',
        'PUT /api/knowledge/:id': '更新知识库(管理员)',
        'DELETE /api/knowledge/:id': '删除知识库(管理员)'
      },
      health: 'GET /api/health - 健康检查'
    },
    testAccounts: [
      { email: 'student@campus.com', password: 'admin123', role: 'student' },
      { email: 'admin@campus.com', password: 'admin123', role: 'admin' }
    ]
  });
});

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404错误处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    timestamp: new Date().toISOString()
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  logger.error('全局错误:', err.message);
  
  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || '服务器内部错误',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
function startServer() {
  try {
    // 启动Express服务器，监听所有接口
    const server = app.listen(config.port, '0.0.0.0', () => {
      logger.info(`🚀 校园智能咨询问答平台服务已启动`);
      logger.info(`📍 服务地址: http://localhost:${config.port}`);
      logger.info(`📍 外部访问: http://0.0.0.0:${config.port}`);
      logger.info(`🔧 环境: ${config.environment}`);
      logger.info(`📊 数据模式: ${USE_MOCK_DB ? '模拟数据' : 'MySQL数据库'}`);
    });
    
    server.on('error', (err) => {
      logger.error('服务器错误:', err.message);
      if (err.code === 'EADDRINUSE') {
        logger.error(`端口 ${config.port} 已被占用，请使用其他端口`);
      }
    });
  } catch (error) {
    logger.error('服务启动失败:', error.message);
    process.exit(1);
  }
}

// 启动服务
startServer();
