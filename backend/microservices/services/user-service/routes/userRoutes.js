const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// 公开路由
router.post('/register', UserController.validate.register, UserController.register);
router.post('/login', UserController.validate.login, UserController.login);

// 需要认证的路由
router.get('/me', UserController.auth, UserController.getCurrentUser);
router.put('/me', UserController.auth, UserController.updateCurrentUser);
router.put('/password', UserController.auth, UserController.changePassword);

// 管理员和客服路由
router.get('/customer-service', UserController.auth, UserController.authorize('admin', 'customer_service'), UserController.getCustomerServiceList);
router.get('/:id', UserController.auth, UserController.authorize('admin', 'customer_service'), UserController.getUserById);

module.exports = router;
