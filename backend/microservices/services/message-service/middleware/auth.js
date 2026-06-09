const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证令牌' });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, 'campus-qa-secret-key-2024');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ code: 401, message: '无效的认证令牌' });
  }
}

module.exports = { auth };
