const QuestionService = require('../services/questionService');

const QuestionController = {
  /**
   * 提交问题
   */
  async submitQuestion(req, res) {
    try {
      const { title, content, category, priority } = req.body;
      const question = await QuestionService.submitQuestion(req.user.userId, {
        title,
        content,
        category,
        priority
      });
      
      res.status(201).json({
        code: 0,
        message: '问题提交成功',
        data: question
      });
    } catch (error) {
      res.status(400).json({
        code: 400,
        message: error.message
      });
    }
  },

  /**
   * 获取问题详情
   */
  async getQuestionById(req, res) {
    try {
      const question = await QuestionService.getQuestionById(req.params.id);
      if (!question) {
        return res.status(404).json({ code: 404, message: '问题不存在' });
      }
      res.json({ code: 0, data: question });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  /**
   * 获取用户问答历史
   */
  async getUserQuestions(req, res) {
    try {
      const { page = 1, pageSize = 10, status, category } = req.query;
      const result = await QuestionService.getUserQuestions(req.user.userId, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        status,
        category
      });
      res.json({ code: 0, data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  /**
   * 获取待处理问题（客服/管理员）
   */
  async getPendingQuestions(req, res) {
    try {
      const { page = 1, pageSize = 10, priority } = req.query;
      const list = await QuestionService.getPendingQuestions({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        priority
      });
      res.json({ code: 0, data: { list } });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  /**
   * 人工回答问题（客服）
   */
  async humanAnswer(req, res) {
    try {
      const { content } = req.body;
      await QuestionService.humanAnswer(req.params.id, req.user.userId, content);
      res.json({ code: 0, message: '回答提交成功' });
    } catch (error) {
      res.status(400).json({ code: 400, message: error.message });
    }
  },

  /**
   * 转接人工客服
   */
  async transferToHuman(req, res) {
    try {
      await QuestionService.transferToHuman(req.params.id);
      res.json({ code: 0, message: '已转接人工客服' });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  /**
   * 解决/关闭问题
   */
  async resolveQuestion(req, res) {
    try {
      await QuestionService.resolveQuestion(req.params.id, req.user.userId);
      res.json({ code: 0, message: '问题已解决' });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
};

module.exports = QuestionController;
