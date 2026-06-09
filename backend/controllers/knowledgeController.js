/**
 * 知识库控制器模块
 * 处理知识库相关的HTTP请求
 */
const knowledgeService = require('../services/knowledgeService');
const response = require('../utils/response');
const logger = require('../utils/logger');

/**
 * 获取知识库列表
 * GET /api/knowledge/list
 */
async function getKnowledgeList(req, res) {
  try {
    const { page = 1, pageSize = 10, category, keyword } = req.query;
    
    const result = await knowledgeService.getKnowledgeList({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      category,
      keyword
    });
    
    response.paginate(res, result.list, result.total, parseInt(page), parseInt(pageSize));
    
  } catch (error) {
    logger.error('获取知识库列表失败:', error.message);
    response.error(res, error.message, 500);
  }
}

/**
 * 获取知识库详情
 * GET /api/knowledge/:id
 */
async function getKnowledgeDetail(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    const knowledge = await knowledgeService.getKnowledgeById(id);
    
    response.success(res, knowledge, '获取成功');
    
  } catch (error) {
    logger.error('获取知识库详情失败:', error.message);
    response.error(res, error.message, 404);
  }
}

/**
 * 创建知识库条目
 * POST /api/knowledge
 */
async function createKnowledge(req, res) {
  try {
    const { title, content, category, keywords } = req.body;
    
    const knowledge = await knowledgeService.createKnowledge({
      title,
      content,
      category: category || 'other',
      keywords
    });
    
    logger.info(`知识库创建成功: ID=${knowledge.id}`);
    response.success(res, knowledge, '创建成功', 201);
    
  } catch (error) {
    logger.error('创建知识库失败:', error.message);
    response.error(res, error.message, 400);
  }
}

/**
 * 更新知识库条目
 * PUT /api/knowledge/:id
 */
async function updateKnowledge(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { title, content, category, keywords } = req.body;
    
    const knowledge = await knowledgeService.updateKnowledge(id, {
      title,
      content,
      category,
      keywords
    });
    
    logger.info(`知识库更新成功: ID=${id}`);
    response.success(res, knowledge, '更新成功');
    
  } catch (error) {
    logger.error('更新知识库失败:', error.message);
    response.error(res, error.message, 400);
  }
}

/**
 * 删除知识库条目
 * DELETE /api/knowledge/:id
 */
async function deleteKnowledge(req, res) {
  try {
    const id = parseInt(req.params.id);
    
    const success = await knowledgeService.deleteKnowledge(id);
    
    if (success) {
      logger.info(`知识库删除成功: ID=${id}`);
      response.success(res, null, '删除成功');
    } else {
      response.error(res, '删除失败，知识库不存在', 404);
    }
    
  } catch (error) {
    logger.error('删除知识库失败:', error.message);
    response.error(res, error.message, 500);
  }
}

module.exports = {
  getKnowledgeList,
  getKnowledgeDetail,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge
};
