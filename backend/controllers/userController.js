/**
 * 用户控制器模块
 * 处理用户相关的HTTP请求
 */
const userService = require('../services/userService');
const response = require('../utils/response');
const logger = require('../utils/logger');

/**
 * 用户注册
 * POST /api/users/register
 */
async function register(req, res) {
  try {
    const { username, password, nickname, role } = req.body;
    
    const user = await userService.register({
      username,
      password,
      nickname,
      role
    });
    
    logger.info(`用户注册成功: ${username}`);
    response.success(res, user, '注册成功', 201);
    
  } catch (error) {
    logger.error('用户注册失败:', error.message);
    response.error(res, error.message, 400);
  }
}

/**
 * 用户登录
 * POST /api/users/login
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;
    
    const result = await userService.login(username, password);
    
    logger.info(`用户登录成功: ${username}`);
    response.success(res, result, '登录成功');
    
  } catch (error) {
    logger.error('用户登录失败:', error.message);
    response.error(res, error.message, 401);
  }
}

/**
 * 获取当前用户信息
 * GET /api/users/me
 */
async function getCurrentUser(req, res) {
  try {
    const user = await userService.getUserById(req.user.id);
    
    response.success(res, user, '获取成功');
    
  } catch (error) {
    logger.error('获取用户信息失败:', error.message);
    response.error(res, error.message, 500);
  }
}

/**
 * 更新用户信息
 * PUT /api/users/me
 */
async function updateCurrentUser(req, res) {
  try {
    const { nickname, avatar } = req.body;
    
    const user = await userService.updateUser(req.user.id, { nickname, avatar });
    
    logger.info(`用户更新成功: ${req.user.email}`);
    response.success(res, user, '更新成功');
    
  } catch (error) {
    logger.error('更新用户信息失败:', error.message);
    response.error(res, error.message, 400);
  }
}

/**
 * 删除用户
 * DELETE /api/users/me
 */
async function deleteCurrentUser(req, res) {
  try {
    const success = await userService.deleteUser(req.user.id);
    
    if (success) {
      logger.info(`用户删除成功: ${req.user.email}`);
      response.success(res, null, '删除成功');
    } else {
      response.error(res, '删除失败', 400);
    }
    
  } catch (error) {
    logger.error('删除用户失败:', error.message);
    response.error(res, error.message, 500);
  }
}

/**
 * 获取当前用户的登录历史
 * GET /api/users/login-history
 */
async function getLoginHistory(req, res) {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    
    const result = await userService.getLoginHistory(req.user.id, {
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
    
    response.success(res, result, '获取成功');
    
  } catch (error) {
    logger.error('获取登录历史失败:', error.message);
    response.error(res, error.message, 500);
  }
}

/**
 * 获取所有登录历史（管理员）
 * GET /api/users/login-history/all
 */
async function getAllLoginHistory(req, res) {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    
    const result = await userService.getAllLoginHistory({
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
    
    response.success(res, result, '获取成功');
    
  } catch (error) {
    logger.error('获取登录历史失败:', error.message);
    response.error(res, error.message, 500);
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getLoginHistory,
  getAllLoginHistory
};
