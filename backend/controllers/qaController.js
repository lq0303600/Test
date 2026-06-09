/**
 * 问答控制器模块
 * 处理问答相关的HTTP请求
 */
const qaService = require('../services/qaService');
const response = require('../utils/response');
const logger = require('../utils/logger');

/**
 * 提交问题并获取回答
 * POST /api/qa/ask
 */
async function askQuestion(req, res) {
  try {
    const { title, content, question } = req.body;
    const userId = req.user.id;
    
    // 支持两种格式：question字段（AI问答）或 title+content字段（问题发布）
    let result;
    if (question) {
      // AI问答模式
      result = await qaService.askAI(userId, question);
      logger.info(`AI问答成功: 用户ID=${userId}`);
      response.success(res, result, '回答成功');
    } else {
      // 问题发布模式
      result = await qaService.submitQuestion(userId, title, content);
      logger.info(`用户提问成功: 用户ID=${userId}, 问题ID=${result.question.id}`);
      response.success(res, result, '提问成功');
    }
    
  } catch (error) {
    logger.error('提问失败:', error.message);
    response.error(res, error.message, 500);
  }
}

/**
 * 获取用户问答历史
 * GET /api/qa/history
 */
async function getHistory(req, res) {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 10, category, status } = req.query;
    
    const result = await qaService.getQuestionHistory(userId, {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      category,
      status
    });
    
    response.paginate(res, result.list, result.total, parseInt(page), parseInt(pageSize));
    
  } catch (error) {
    logger.error('获取问答历史失败:', error.message);
    response.error(res, error.message, 500);
  }
}

/**
 * 获取单个问题详情
 * GET /api/qa/questions/:id
 */
async function getQuestionDetail(req, res) {
  try {
    const userId = req.user.id;
    const questionId = parseInt(req.params.id);
    
    const question = await qaService.getQuestionById(questionId, userId);
    
    response.success(res, question, '获取成功');
    
  } catch (error) {
    logger.error('获取问题详情失败:', error.message);
    response.error(res, error.message, 404);
  }
}

/**
 * 获取消息列表
 * GET /api/qa/messages
 */
async function getMessages(req, res) {
  try {
    const userId = req.user.id;
    const { page = 1, pageSize = 20 } = req.query;
    
    const result = await qaService.getMessages(userId, {
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
    
    response.paginate(res, result.list, result.total, parseInt(page), parseInt(pageSize));
    
  } catch (error) {
    logger.error('获取消息列表失败:', error.message);
    response.error(res, error.message, 500);
  }
}

module.exports = {
  askQuestion,
  getHistory,
  getQuestionDetail,
  getMessages
};
