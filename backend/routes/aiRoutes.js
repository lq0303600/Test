/**
 * AI服务路由模块
 * 定义AI相关的API端点
 */
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// 搜索融合接口 - AI问答与校园搜索融合
router.post('/search-ask', aiController.searchAsk);

module.exports = router;