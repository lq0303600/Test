/**
 * 问答服务模块
 * 处理问题提交、AI回答、历史查询等业务逻辑
 */
const { db, USE_MOCK_DB } = require('../database/adapter');
const knowledgeService = require('./knowledgeService');
const aiService = require('./aiService');
const config = require('../config/ai');
const logger = require('../utils/logger');

/**
 * 提交问题并获取回答
 * @param {number} userId - 用户ID
 * @param {string} title - 问题标题
 * @param {string} content - 问题内容
 * @returns {Object} - 包含问题和回答的结果
 */
async function submitQuestion(userId, title, content) {
  // 1. 对问题进行分类
  const category = aiService.classifyQuestion(content);
  
  // 2. 先从知识库检索相似问题
  const similarKnowledge = await knowledgeService.searchSimilarKnowledge(content, 3);
  
  let answerContent;
  let source = 'ai';
  let accuracy = 0.7;
  
  // 3. 判断是否使用知识库回答
  const hasGoodMatch = similarKnowledge.some(item => item.similarity_score >= config.knowledgeThreshold);
  
  if (hasGoodMatch && similarKnowledge.length > 0) {
    // 使用知识库内容作为回答
    answerContent = similarKnowledge[0].content;
    source = 'knowledge_base';
    accuracy = similarKnowledge[0].similarity_score;
    logger.info('使用知识库回答，相似度:', accuracy);
  } else {
    // 调用AI生成回答
    const context = similarKnowledge.map(k => `${k.title}\n${k.content}`).join('\n\n');
    answerContent = await aiService.generateAnswer(content, context);
    source = 'ai';
    logger.info('使用AI生成回答');
  }
  
  // 4. 创建问题记录
  const questionResult = USE_MOCK_DB
    ? await db.insertQuestion({ user_id: userId, title, content, category, status: 'answered' })
    : await db.execute(
        'INSERT INTO questions (user_id, title, content, category, status) VALUES (?, ?, ?, ?, ?)',
        [userId, title, content, category, 'answered']
      );
  
  const questionId = questionResult.insertId;
  
  // 5. 创建回答记录
  const answerResult = USE_MOCK_DB
    ? await db.insertAnswer({ question_id: questionId, content: answerContent, source, accuracy })
    : await db.execute(
        'INSERT INTO answers (question_id, content, source, accuracy) VALUES (?, ?, ?, ?)',
        [questionId, answerContent, source, accuracy]
      );
  
  // 6. 创建消息记录
  await (USE_MOCK_DB
    ? db.insertMessage({ user_id: userId, question_id: questionId, content, type: 'question' })
    : db.execute(
        'INSERT INTO messages (user_id, question_id, content, type) VALUES (?, ?, ?, ?)',
        [userId, questionId, content, 'question']
      )
  );
  
  await (USE_MOCK_DB
    ? db.insertMessage({ user_id: userId, question_id: questionId, content: answerContent, type: 'answer' })
    : db.execute(
        'INSERT INTO messages (user_id, question_id, content, type) VALUES (?, ?, ?, ?)',
        [userId, questionId, answerContent, 'answer']
      )
  );
  
  return {
    question: {
      id: questionId,
      title,
      content,
      category,
      status: 'answered',
      created_at: new Date().toISOString()
    },
    answer: {
      id: answerResult.insertId,
      content: answerContent,
      source,
      accuracy,
      created_at: new Date().toISOString()
    }
  };
}

/**
 * 获取用户的问答历史
 * @param {number} userId - 用户ID
 * @param {Object} options - 查询选项
 * @returns {Object} - 包含列表和总数的结果
 */
async function getQuestionHistory(userId, options = {}) {
  const { page = 1, pageSize = 10, category, status } = options;
  
  if (USE_MOCK_DB) {
    return await db.queryQuestionsByUserId(userId, { page, pageSize, category, status });
  }
  
  const offset = (page - 1) * pageSize;
  
  let sql = `SELECT 
               q.id, q.title, q.content, q.category, q.status, q.created_at,
               a.content as answer_content, a.source as answer_source, a.accuracy as answer_accuracy
             FROM questions q
             LEFT JOIN answers a ON q.id = a.question_id
             WHERE q.user_id = ?`;
  
  const params = [userId];
  
  if (category) {
    sql += ' AND q.category = ?';
    params.push(category);
  }
  
  if (status) {
    sql += ' AND q.status = ?';
    params.push(status);
  }
  
  // 获取总数
  const countSql = sql.replace(`SELECT 
               q.id, q.title, q.content, q.category, q.status, q.created_at,
               a.content as answer_content, a.source as answer_source, a.accuracy as answer_accuracy
             FROM`, 'SELECT COUNT(*) as total FROM');
  const countResult = await db.query(countSql, params);
  const total = countResult[0]?.total || 0;
  
  // 使用字符串拼接LIMIT
  sql += ` ORDER BY q.created_at DESC LIMIT ${parseInt(pageSize)} OFFSET ${parseInt(offset)}`;
  
  const list = await db.query(sql, params);
  
  return {
    list,
    total
  };
}

/**
 * 根据ID获取问题详情
 * @param {number} questionId - 问题ID
 * @param {number} userId - 用户ID（用于验证权限）
 * @returns {Object} - 问题详情
 */
async function getQuestionById(questionId, userId) {
  const result = USE_MOCK_DB
    ? await db.queryQuestionByIdAndUserId(questionId, userId)
    : await db.query(
        `SELECT 
           q.id, q.title, q.content, q.category, q.status, q.created_at,
           a.content as answer_content, a.source as answer_source, a.accuracy as answer_accuracy, a.created_at as answer_created_at
         FROM questions q
         LEFT JOIN answers a ON q.id = a.question_id
         WHERE q.id = ? AND q.user_id = ?`,
        [questionId, userId]
      );
  
  if (result.length === 0) {
    throw new Error('问题不存在或无权访问');
  }
  
  return result[0];
}

/**
 * 获取消息列表
 * @param {number} userId - 用户ID
 * @param {Object} options - 查询选项
 * @returns {Object} - 包含列表和总数的结果
 */
async function getMessages(userId, options = {}) {
  const { page = 1, pageSize = 20 } = options;
  
  if (USE_MOCK_DB) {
    return await db.queryMessagesByUserId(userId, { page, pageSize });
  }
  
  const offset = (page - 1) * pageSize;
  
  // 使用字符串拼接LIMIT
  const list = await db.query(
    `SELECT id, question_id, content, type, created_at FROM messages WHERE user_id = ? ORDER BY created_at DESC LIMIT ${parseInt(pageSize)} OFFSET ${parseInt(offset)}`,
    [userId]
  );
  
  const countResult = await db.query(
    'SELECT COUNT(*) as total FROM messages WHERE user_id = ?',
    [userId]
  );
  
  return {
    list,
    total: countResult[0]?.total || 0
  };
}

/**
 * AI问答接口
 * @param {number} userId - 用户ID
 * @param {string} question - 问题内容
 * @returns {Object} - AI回答结果
 */
async function askAI(userId, question) {
  // 1. 对问题进行分类
  const category = aiService.classifyQuestion(question);
  
  // 2. 先从知识库检索相似问题
  const similarKnowledge = await knowledgeService.searchSimilarKnowledge(question, 3);
  
  let answerContent;
  let source = 'ai';
  let accuracy = 0.7;
  
  // 3. 判断是否使用知识库回答
  const hasGoodMatch = similarKnowledge.some(item => item.similarity_score >= config.knowledgeThreshold);
  
  if (hasGoodMatch && similarKnowledge.length > 0) {
    // 使用知识库内容作为回答
    answerContent = similarKnowledge[0].content;
    source = 'knowledge_base';
    accuracy = similarKnowledge[0].similarity_score;
    logger.info('使用知识库回答，相似度:', accuracy);
  } else {
    // 调用AI生成回答
    const context = similarKnowledge.map(k => `${k.title}\n${k.content}`).join('\n\n');
    answerContent = await aiService.generateAnswer(question, context);
    source = 'ai';
    logger.info('使用AI生成回答');
  }
  
  return {
    answer: answerContent,
    confidence: accuracy,
    intent: { type: '咨询', confidence: 0.7 },
    category: category,
    knowledgeUsed: source === 'knowledge_base'
  };
}

module.exports = {
  submitQuestion,
  askAI,
  getQuestionHistory,
  getQuestionById,
  getMessages
};
