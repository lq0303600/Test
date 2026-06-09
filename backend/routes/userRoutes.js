/**
 * 用户路由模块
 * 定义用户相关的API端点
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// 用户注册
router.post('/register', validate.validateRegister, userController.register);

// 用户登录
router.post('/login', validate.validateLogin, userController.login);

// 获取当前用户信息
router.get('/me', auth.authenticateToken, userController.getCurrentUser);

// 更新当前用户信息
router.put('/me', auth.authenticateToken, userController.updateCurrentUser);

// 删除当前用户
router.delete('/me', auth.authenticateToken, userController.deleteCurrentUser);

// 获取当前用户的登录历史
router.get('/login-history', auth.authenticateToken, userController.getLoginHistory);

// 获取所有登录历史（管理员）
router.get('/login-history/all', auth.authenticateToken, userController.getAllLoginHistory);

module.exports = router;
