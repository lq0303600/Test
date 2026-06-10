const AIService = require('../services/aiService');
const WeatherService = require('../services/weatherService');

const AIController = {
  /**
   * 处理问答
   */
  async ask(req, res) {
    try {
      const { question_id, title, content, category, original_user_id } = req.body;
      
      if (!title && !content) {
        return res.status(400).json({
          code: 400,
          message: '问题内容不能为空'
        });
      }

      const result = await AIService.processQuestion({
        question_id,
        title,
        content,
        category
      });

      res.json({
        code: 0,
        message: '处理成功',
        data: {
          ...result,
          original_user_id: original_user_id || req.body.user_id
        }
      });
    } catch (error) {
      console.error('AI处理错误:', error);
      res.status(500).json({
        code: 500,
        message: 'AI处理失败',
        error: error.message
      });
    }
  },

  /**
   * 搜索融合接口 - 同时进行AI问答和信息检索
   */
  async searchAsk(req, res) {
    try {
      const { question, search_type = 'combined' } = req.body;
      
      if (!question) {
        return res.status(400).json({
          code: 400,
          message: '问题不能为空'
        });
      }

      const result = await AIService.searchAndAsk(question, search_type);

      res.json({
        code: 0,
        message: '处理成功',
        data: result
      });
    } catch (error) {
      console.error('搜索融合处理错误:', error);
      res.status(500).json({
        code: 500,
        message: '搜索融合处理失败',
        error: error.message
      });
    }
  },

  /**
   * 意图识别
   */
  async recognizeIntent(req, res) {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ code: 400, message: '问题不能为空' });
      }

      const result = await AIService.recognizeIntent(question);
      res.json({ code: 0, data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  /**
   * 问题分类
   */
  async classify(req, res) {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ code: 400, message: '问题不能为空' });
      }

      const result = await AIService.classifyQuestion(question);
      res.json({ code: 0, data: { category: result } });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  /**
   * RAG检索测试
   */
  async retrieve(req, res) {
    try {
      const { query, limit = 5 } = req.query;
      if (!query) {
        return res.status(400).json({ code: 400, message: '查询词不能为空' });
      }

      const results = await AIService.ragRetrieve(query, parseInt(limit));
      res.json({ code: 0, data: results });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  /**
   * 获取当前天气
   */
  async getWeather(req, res) {
    try {
      const { city = '北京' } = req.query;
      const weather = await WeatherService.getWeather(city);
      res.json({ code: 0, message: '获取成功', data: weather });
    } catch (error) {
      console.error('获取天气失败:', error);
      res.status(500).json({ code: 500, message: '获取天气失败', error: error.message });
    }
  },

  /**
   * 获取天气预报
   */
  async getWeatherForecast(req, res) {
    try {
      const { city = '北京', days = 3 } = req.query;
      const forecast = await WeatherService.getWeatherForecast(city, parseInt(days));
      res.json({ code: 0, message: '获取成功', data: forecast });
    } catch (error) {
      console.error('获取天气预报失败:', error);
      res.status(500).json({ code: 500, message: '获取天气预报失败', error: error.message });
    }
  }
};

module.exports = AIController;
