const UserService = require('../services/userService');

/**
 * 认证中间件
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
  const decoded = UserService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      code: 401,
      message: '无效的认证令牌',
      timestamp: new Date().toISOString()
    });
  }

  req.user = decoded;
  next();
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

module.exports = {
  auth,
  authorize
};
