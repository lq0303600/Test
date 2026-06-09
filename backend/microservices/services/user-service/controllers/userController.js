const UserService = require('../services/userService');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

/**
 * 用户控制器
 */
const UserController = {
  /**
   * 用户注册
   */
  async register(req, res) {
    try {
      const { username, password, role, nickname, phone } = req.body;
      
      const user = await UserService.register({
        username,
        password,
        role,
        nickname,
        phone
      });

      res.status(201).json({
        code: 0,
        message: '注册成功',
        data: user,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(400).json({
        code: 400,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * 用户登录
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      const result = await UserService.login(username, password);

      res.json({
        code: 0,
        message: '登录成功',
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(401).json({
        code: 401,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(req, res) {
    try {
      const user = await UserService.getUserById(req.user.userId);

      res.json({
        code: 0,
        message: '获取成功',
        data: user,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(404).json({
        code: 404,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * 更新当前用户信息
   */
  async updateCurrentUser(req, res) {
    try {
      const { nickname, avatar, phone } = req.body;
      
      const user = await UserService.updateUser(req.user.userId, {
        nickname,
        avatar,
        phone
      });

      res.json({
        code: 0,
        message: '更新成功',
        data: user,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(400).json({
        code: 400,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * 修改密码
   */
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      
      await UserService.changePassword(req.user.userId, oldPassword, newPassword);

      res.json({
        code: 0,
        message: '密码修改成功',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(400).json({
        code: 400,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * 获取客服列表（管理员）
   */
  async getCustomerServiceList(req, res) {
    try {
      const list = await UserService.getCustomerServiceList();

      res.json({
        code: 0,
        message: '获取成功',
        data: list,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * 根据ID获取用户信息（管理员/客服）
   */
  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);

      res.json({
        code: 0,
        message: '获取成功',
        data: user,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(404).json({
        code: 404,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
};

module.exports = {
  ...UserController,
  auth,
  authorize,
  validate
};
