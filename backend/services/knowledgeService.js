/**
 * 知识库服务模块
 * 处理知识库相关的业务逻辑
 */
const { db, USE_MOCK_DB } = require('../database/adapter');

/**
 * 获取知识库列表
 * @param {Object} options - 查询选项
 * @returns {Array} - 知识库列表
 */
async function getKnowledgeList(options = {}) {
  const { page = 1, pageSize = 10, category, keyword } = options;
  
  if (USE_MOCK_DB) {
    return await db.queryKnowledgeList({ page, pageSize, category, keyword });
  }
  
  const offset = (page - 1) * pageSize;
  
  let sql = 'SELECT * FROM knowledge_base WHERE 1=1';
  const params = [];
  
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  
  if (keyword) {
    sql += ' AND (title LIKE ? OR content LIKE ? OR keywords LIKE ?)';
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }
  
  // 获取总数
  const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
  const countResult = await db.query(countSql, params);
  const total = countResult[0]?.total || 0;
  
  // 使用字符串拼接LIMIT（避免prepared statement参数问题）
  sql += ` ORDER BY created_at DESC LIMIT ${parseInt(pageSize)} OFFSET ${parseInt(offset)}`;
  
  const list = await db.query(sql, params);
  
  return {
    list,
    total
  };
}

/**
 * 根据ID获取知识库详情
 * @param {number} id - 知识库ID
 * @returns {Object} - 知识库详情
 */
async function getKnowledgeById(id) {
  const result = USE_MOCK_DB
    ? await db.queryKnowledgeById(id)
    : await db.query('SELECT * FROM knowledge_base WHERE id = ?', [id]);
  
  if (result.length === 0) {
    throw new Error('知识库不存在');
  }
  
  return result[0];
}

/**
 * 创建知识库条目
 * @param {Object} data - 知识库数据
 * @returns {Object} - 创建的知识库条目
 */
async function createKnowledge(data) {
  const { title, content, category = 'other', keywords } = data;
  
  const result = USE_MOCK_DB
    ? await db.insertKnowledge({ title, content, category, keywords })
    : await db.execute(
        'INSERT INTO knowledge_base (title, content, category, keywords) VALUES (?, ?, ?, ?)',
        [title, content, category, keywords]
      );
  
  return await getKnowledgeById(result.insertId);
}

/**
 * 更新知识库条目
 * @param {number} id - 知识库ID
 * @param {Object} data - 更新数据
 * @returns {Object} - 更新后的知识库条目
 */
async function updateKnowledge(id, data) {
  const { title, content, category, keywords } = data;
  
  if (!title && !content && !category && !keywords) {
    throw new Error('没有需要更新的字段');
  }
  
  if (USE_MOCK_DB) {
    await db.updateKnowledge(id, { title, content, category, keywords });
  } else {
    const fields = [];
    const params = [];
    
    if (title) {
      fields.push('title = ?');
      params.push(title);
    }
    
    if (content) {
      fields.push('content = ?');
      params.push(content);
    }
    
    if (category) {
      fields.push('category = ?');
      params.push(category);
    }
    
    if (keywords) {
      fields.push('keywords = ?');
      params.push(keywords);
    }
    
    params.push(id);
    
    await db.execute(
      `UPDATE knowledge_base SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
  }
  
  return await getKnowledgeById(id);
}

/**
 * 删除知识库条目
 * @param {number} id - 知识库ID
 * @returns {boolean} - 删除是否成功
 */
async function deleteKnowledge(id) {
  const result = USE_MOCK_DB
    ? await db.deleteKnowledge(id)
    : await db.execute('DELETE FROM knowledge_base WHERE id = ?', [id]);
  
  return result.affectedRows > 0;
}

/**
 * 检索相似知识库
 * @param {string} queryText - 查询文本
 * @param {number} limit - 返回数量限制
 * @returns {Array} - 相似知识库列表
 */
async function searchSimilarKnowledge(queryText, limit = 5) {
  if (USE_MOCK_DB) {
    return await db.searchSimilarKnowledge(queryText, limit);
  }
  
  // 使用简单的LIKE查询代替FULLTEXT（避免参数问题）
  const result = await db.query(
    `SELECT *, 
            (CASE 
              WHEN title LIKE ? THEN 0.8 
              WHEN content LIKE ? THEN 0.6 
              WHEN keywords LIKE ? THEN 0.4 
              ELSE 0.1 
            END) as similarity_score
     FROM knowledge_base 
     WHERE title LIKE ? OR content LIKE ? OR keywords LIKE ?
     ORDER BY similarity_score DESC
     LIMIT ${parseInt(limit)}`,
    [`%${queryText}%`, `%${queryText}%`, `%${queryText}%`, `%${queryText}%`, `%${queryText}%`, `%${queryText}%`]
  );
  
  return result;
}

module.exports = {
  getKnowledgeList,
  getKnowledgeById,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
  searchSimilarKnowledge
};
