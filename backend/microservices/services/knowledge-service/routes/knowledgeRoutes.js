const express = require('express');
const router = express.Router();
const KnowledgeController = require('../controllers/knowledgeController');
const { verifyToken, authorize } = require('../middleware/auth');

// 公开路由
router.get('/list', KnowledgeController.getList);
router.get('/search', KnowledgeController.search);
router.get('/categories', KnowledgeController.getCategories);
router.get('/:id', KnowledgeController.getById);

// 需要管理员权限的路由
router.post('/', verifyToken, authorize('admin', 'teacher'), KnowledgeController.create);
router.put('/:id', verifyToken, authorize('admin', 'teacher'), KnowledgeController.update);
router.delete('/:id', verifyToken, authorize('admin'), KnowledgeController.delete);

module.exports = router;
