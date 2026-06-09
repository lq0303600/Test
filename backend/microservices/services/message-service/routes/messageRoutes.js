const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

// 内部服务调用（无需认证）
router.post('/notify', MessageController.notify);

// 需要认证的路由
router.get('/list', auth, MessageController.getUserMessages);
router.put('/:id/read', auth, MessageController.markAsRead);
router.put('/read-all', auth, MessageController.markAllAsRead);
router.delete('/:id', auth, MessageController.deleteMessage);

module.exports = router;
