/**
 * 问答路由模块
 * 定义问答相关的API端点
 */
const express = require('express');
const router = express.Router();
const qaController = require('../controllers/qaController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// 提交问题并获取回答
router.post('/ask', auth.authenticateToken, validate.validateQuestion, qaController.askQuestion);

// 获取用户问答历史
router.get('/history', auth.authenticateToken, qaController.getHistory);

// 获取单个问题详情
router.get('/questions/:id', auth.authenticateToken, qaController.getQuestionDetail);

// 获取消息列表
router.get('/messages', auth.authenticateToken, qaController.getMessages);

module.exports = router;
