const KnowledgeService = require('../services/knowledgeService');

const KnowledgeController = {
  async create(req, res) {
    try {
      const knowledge = await KnowledgeService.create(req.body);
      res.status(201).json({
        code: 0,
        message: '创建成功',
        data: knowledge
      });
    } catch (error) {
      res.status(400).json({
        code: 400,
        message: error.message
      });
    }
  },

  async getById(req, res) {
    try {
      const knowledge = await KnowledgeService.getById(req.params.id);
      if (!knowledge) {
        return res.status(404).json({ code: 404, message: '知识不存在' });
      }
      res.json({
        code: 0,
        data: knowledge
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  async getList(req, res) {
    try {
      const { page = 1, pageSize = 10, category, keyword } = req.query;
      const result = await KnowledgeService.getList({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        category,
        keyword
      });
      res.json({
        code: 0,
        data: result
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  async search(req, res) {
    try {
      const { q, limit = 5 } = req.query;
      const result = await KnowledgeService.search(q, parseInt(limit));
      res.json({
        code: 0,
        data: result
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const knowledge = await KnowledgeService.update(req.params.id, req.body);
      if (!knowledge) {
        return res.status(404).json({ code: 404, message: '知识不存在' });
      }
      res.json({
        code: 0,
        message: '更新成功',
        data: knowledge
      });
    } catch (error) {
      res.status(400).json({ code: 400, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const success = await KnowledgeService.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ code: 404, message: '知识不存在' });
      }
      res.json({
        code: 0,
        message: '删除成功'
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  async getCategories(req, res) {
    res.json({
      code: 0,
      data: KnowledgeService.getCategories()
    });
  }
};

module.exports = KnowledgeController;
