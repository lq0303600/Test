const jwt = require('jsonwebtoken');
const config = require('../config/app');

function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret || 'campus-qa-secret-key-2024');
  } catch (error) {
    return null;
  }
}

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证令牌' });
  }
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ code: 401, message: '无效的认证令牌' });
  }
  req.user = decoded;
  next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ code: 403, message: '权限不足' });
    }
    next();
  };
}

module.exports = { verifyToken, auth, authorize };
