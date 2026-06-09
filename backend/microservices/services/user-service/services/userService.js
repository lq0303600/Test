const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const config = require('../config/app');

/**
 * 用户服务 - 业务逻辑
 */
const UserService = {
  /**
   * 用户注册
   */
  async register(userData) {
    const { username, password, role = 'student', nickname, phone } = userData;

    // 检查用户名是否存在
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const userId = await UserModel.create({
      username,
      password: hashedPassword,
      role,
      nickname,
      phone
    });

    // 返回用户信息（不包含密码）
    return {
      id: userId,
      username,
      role: role || 'student',
      nickname: nickname || username
    };
  },

  /**
   * 用户登录
   */
  async login(username, password) {
    // 查询用户
    const user = await UserModel.findByUsername(username);
    if (!user) {
      throw new Error('用户名或密码错误');
    }

    // 检查用户状态
    if (user.status !== 'active') {
      throw new Error('账号已被禁用');
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('用户名或密码错误');
    }

    // 生成JWT Token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        nickname: user.nickname,
        avatar: user.avatar
      },
      token
    };
  },

  /**
   * 获取用户信息
   */
  async getUserById(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  },

  /**
   * 更新用户信息
   */
  async updateUser(userId, updateData) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    await UserModel.update(userId, updateData);
    return await this.getUserById(userId);
  },

  /**
   * 修改密码
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证旧密码
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error('原密码错误');
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(userId, hashedPassword);

    return true;
  },

  /**
   * 获取所有客服
   */
  async getCustomerServiceList() {
    return await UserModel.findCustomerService();
  },

  /**
   * 验证Token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      return null;
    }
  }
};

module.exports = UserService;
