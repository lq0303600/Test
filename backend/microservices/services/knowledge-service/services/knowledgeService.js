const KnowledgeModel = require('../models/knowledgeModel');

const KnowledgeService = {
  async create(data) {
    const id = await KnowledgeModel.create(data);
    return await KnowledgeModel.findById(id);
  },

  async getById(id) {
    const knowledge = await KnowledgeModel.findById(id);
    if (knowledge) {
      await KnowledgeModel.incrementViews(id);
    }
    return knowledge;
  },

  async getList(options) {
    return await KnowledgeModel.findAll(options);
  },

  async search(query, limit = 5) {
    return await KnowledgeModel.search(query, limit);
  },

  async update(id, data) {
    const success = await KnowledgeModel.update(id, data);
    if (success) {
      return await KnowledgeModel.findById(id);
    }
    return null;
  },

  async delete(id) {
    return await KnowledgeModel.delete(id);
  },

  getCategories() {
    return [
      { value: 'admission', label: '入学指南' },
      { value: 'academic', label: '学术' },
      { value: 'campus', label: '校园' },
      { value: 'career', label: '就业' },
      { value: 'life', label: '生活' },
      { value: 'other', label: '其他' }
    ];
  }
};

module.exports = KnowledgeService;
