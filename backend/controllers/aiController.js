/**
 * AI控制器模块
 * 处理AI相关的HTTP请求
 */
const aiService = require('../services/aiService');
const response = require('../utils/response');
const logger = require('../utils/logger');

const aiController = {
  /**
   * 搜索融合接口 - 同时进行AI问答和信息检索
   */
  async searchAsk(req, res) {
    try {
      // 获取问题参数，支持多种来源
      let question = req.body.question || req.body.q || req.body.title;
      const search_type = req.body.search_type || req.body.type || 'combined';
      
      // 如果是字符串但被包裹在对象中，尝试解析
      if (typeof question === 'object' && question !== null) {
        question = question.content || question.text || JSON.stringify(question);
      }
      
      if (!question || typeof question !== 'string' || question.trim() === '') {
        return response.error(res, '问题不能为空', 400);
      }
      
      question = question.trim();

      // 设置超时处理
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('请求超时')), 25000);
      });

      // 调用AI服务进行搜索融合，设置超时
      const result = await Promise.race([
        aiService.searchAndAsk(question, search_type),
        timeoutPromise
      ]);

      response.success(res, result, '处理成功');
    } catch (error) {
      logger.error('搜索融合处理错误:', error.message);
      
      // 如果是超时错误，返回友好的错误消息
      if (error.message === '请求超时') {
        return response.error(res, '请求处理超时，请稍后重试', 500);
      }
      
      response.error(res, '搜索融合处理失败', 500);
    }
  }
};

module.exports = aiController;