/**
 * 验证中间件
 */
const validate = {
  /**
   * 验证注册参数
   */
  register(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码都是必填项',
        timestamp: new Date().toISOString()
      });
    }

    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({
        code: 400,
        message: '用户名长度必须在3-50个字符之间',
        timestamp: new Date().toISOString()
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        code: 400,
        message: '密码长度至少为6个字符',
        timestamp: new Date().toISOString()
      });
    }

    // 验证角色
    const validRoles = ['student', 'teacher', 'admin', 'customer_service'];
    if (req.body.role && !validRoles.includes(req.body.role)) {
      return res.status(400).json({
        code: 400,
        message: '无效的用户角色',
        timestamp: new Date().toISOString()
      });
    }

    next();
  },

  /**
   * 验证登录参数
   */
  login(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码都是必填项',
        timestamp: new Date().toISOString()
      });
    }

    next();
  }
};

module.exports = validate;
