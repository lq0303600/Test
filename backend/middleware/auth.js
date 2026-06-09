/**
 * 认证中间件模块
 * 处理JWT token验证
 */
const jwt = require('jsonwebtoken');
const config = require('../config/app');
const response = require('../utils/response');

/**
 * JWT认证中间件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - 下一个中间件
 */
function authenticateToken(req, res, next) {
  // 从请求头获取token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return response.error(res, '未提供认证token', 401);
  }
  
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return response.error(res, '无效的token', 403);
    }
    
    // 将用户信息添加到请求对象中
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  });
}

/**
 * 管理员权限验证中间件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - 下一个中间件
 */
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return response.error(res, '需要管理员权限', 403);
  }
  next();
}

/**
 * 教师权限验证中间件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - 下一个中间件
 */
function requireTeacher(req, res, next) {
  if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
    return response.error(res, '需要教师或管理员权限', 403);
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireTeacher
};
