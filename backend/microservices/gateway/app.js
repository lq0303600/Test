/**
 * API网关入口
 * 端口: 3000
 * 统一入口，分发请求到各个微服务
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const axios = require('axios');
const path = require('path');
const config = require('./config/app');
const { logger, errorHandler } = require('./middleware/gateway');

const app = express();

// 中间件
app.use(cors());
app.use(compression());
app.use(express.json());

// 静态文件服务 - 提供前端页面
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger);

// 首页路由 - 返回前端页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 健康检查
app.get('/health', async (req, res) => {
  const services = {};
  
  // 检查各服务健康状态
  const serviceUrls = [
    { name: 'user', url: `${config.services.userService}/health` },
    { name: 'knowledge', url: `${config.services.knowledgeService}/health` },
    { name: 'qa', url: `${config.services.qaService}/health` },
    { name: 'ai', url: `${config.services.aiService}/health` },
    { name: 'message', url: `${config.services.messageService}/health` }
  ];

  for (const svc of serviceUrls) {
    try {
      const response = await axios.get(svc.url, { timeout: 2000 });
      services[svc.name] = { status: 'ok' };
    } catch (error) {
      services[svc.name] = { status: 'error', message: error.message };
    }
  }

  res.json({
    gateway: 'ok',
    services,
    timestamp: new Date().toISOString()
  });
});

// 用户服务路由
app.use('/api/users', async (req, res) => {
  try {
    const url = `${config.services.userService}/api/users${req.path}`;
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      params: req.query,
      headers: {
        ...req.headers,
        host: undefined
      },
      timeout: 10000
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleServiceError(error, res);
  }
});

// 知识库服务路由
app.use('/api/knowledge', async (req, res) => {
  try {
    const url = `${config.services.knowledgeService}/api/knowledge${req.path}`;
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      params: req.query,
      headers: {
        ...req.headers,
        host: undefined,
        authorization: req.headers.authorization
      },
      timeout: 10000
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleServiceError(error, res);
  }
});

// 问答服务路由 - /api/questions
app.use('/api/questions', async (req, res) => {
  try {
    const url = `${config.services.qaService}/api/questions${req.path}`;
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      params: req.query,
      headers: {
        ...req.headers,
        host: undefined,
        authorization: req.headers.authorization
      },
      timeout: 30000 // 问答可能需要较长时间
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleServiceError(error, res);
  }
});

// 问答服务路由 - /api/qa (兼容前端)
app.use('/api/qa', async (req, res) => {
  try {
    // 将 /api/qa/ask 映射到 /api/questions
    let path = req.path;
    if (path === '/ask') path = '';
    
    const url = `${config.services.qaService}/api/questions${path}`;
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      params: req.query,
      headers: {
        ...req.headers,
        host: undefined,
        authorization: req.headers.authorization
      },
      timeout: 30000
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleServiceError(error, res);
  }
});

// 消息服务路由
app.use('/api/messages', async (req, res) => {
  try {
    const url = `${config.services.messageService}/api/messages${req.path}`;
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      params: req.query,
      headers: {
        ...req.headers,
        host: undefined,
        authorization: req.headers.authorization
      },
      timeout: 10000
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleServiceError(error, res);
  }
});

// AI服务路由（内部调用）
app.use('/api/ai', async (req, res) => {
  try {
    const url = `${config.services.aiService}/api/ai${req.path}`;
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      params: req.query,
      headers: {
        ...req.headers,
        host: undefined
      },
      timeout: 30000
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleServiceError(error, res);
  }
});

// 处理服务错误
function handleServiceError(error, res) {
  if (error.response) {
    return res.status(error.response.status).json(error.response.data);
  }
  console.error('Service call error:', error.message);
  res.status(503).json({
    code: 503,
    message: '服务暂时不可用',
    timestamp: new Date().toISOString()
  });
}

// 校园服务路由
const campusService = require('./routes/campusService');
app.use('/api/campus', campusService);

// 错误处理
app.use(errorHandler);

// 404处理 - API请求返回404，其他请求返回首页（SPA路由）
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({
      code: 404,
      message: 'API路由不存在',
      timestamp: new Date().toISOString()
    });
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// 启动 - 监听所有接口
app.listen(config.port, '0.0.0.0', () => {
  console.log(`========================================`);
  console.log(`校园智能问答平台 API网关已启动`);
  console.log(`地址: http://0.0.0.0:${config.port}`);
  console.log(`本地访问: http://localhost:${config.port}`);
  console.log(`========================================`);
  console.log(`用户服务: ${config.services.userService}`);
  console.log(`知识库服务: ${config.services.knowledgeService}`);
  console.log(`问答服务: ${config.services.qaService}`);
  console.log(`AI服务: ${config.services.aiService}`);
  console.log(`消息服务: ${config.services.messageService}`);
  console.log(`========================================`);
});
