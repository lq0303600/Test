/**
 * 知识库路由模块
 * 定义知识库相关的API端点
 */
const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledgeController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// 获取知识库列表（公开接口）
router.get('/list', knowledgeController.getKnowledgeList);

// 获取知识库详情（公开接口）
router.get('/:id', knowledgeController.getKnowledgeDetail);

// 创建知识库条目（需要管理员权限）
router.post('/', auth.authenticateToken, auth.requireAdmin, validate.validateKnowledge, knowledgeController.createKnowledge);

// 更新知识库条目（需要管理员权限）
router.put('/:id', auth.authenticateToken, auth.requireAdmin, knowledgeController.updateKnowledge);

// 删除知识库条目（需要管理员权限）
router.delete('/:id', auth.authenticateToken, auth.requireAdmin, knowledgeController.deleteKnowledge);

module.exports = router;
