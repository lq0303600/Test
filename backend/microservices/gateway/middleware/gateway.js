const axios = require('axios');
const config = require('../config/app');

/**
 * 认证中间件 - 验证Token并获取用户信息
 */
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: '未提供认证令牌',
      timestamp: new Date().toISOString()
    });
  }

  const token = authHeader.substring(7);
  
  // 验证Token（调用用户服务）
  axios.get(`${config.services.userService}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(response => {
    req.user = response.data.data;
    req.token = token;
    next();
  })
  .catch(error => {
    if (error.response?.status === 401) {
      return res.status(401).json({
        code: 401,
        message: '无效的认证令牌',
        timestamp: new Date().toISOString()
      });
    }
    return res.status(500).json({
      code: 500,
      message: '认证服务不可用',
      timestamp: new Date().toISOString()
    });
  });
}

/**
 * 角色权限中间件
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: '未认证',
        timestamp: new Date().toISOString()
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        code: 403,
        message: '权限不足',
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
}

/**
 * 日志中间件
 */
function logger(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}

/**
 * 错误处理中间件
 */
function errorHandler(err, req, res, next) {
  console.error('Gateway Error:', err);
  
  res.status(500).json({
    code: 500,
    message: '网关内部错误',
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  auth,
  authorize,
  logger,
  errorHandler
};
