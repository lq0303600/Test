/**
 * 数据库适配器模块
 * 支持真实MySQL和模拟数据两种模式
 */
const { mockUsers, mockKnowledge, mockQuestions, mockAnswers, mockMessages, mockLoginHistory, getNextUserId, getNextQuestionId, getNextAnswerId, getNextMessageId, getNextLoginHistoryId } = require('./mockData');
const logger = require('../utils/logger');

// 当前使用的数据库模式
const USE_MOCK_DB = true;

// Mock数据库操作
const mockDb = {
  // 用户操作
  async queryUserByUsername(username) {
    return mockUsers.filter(u => u.username === username);
  },
  
  async queryUserById(id) {
    return mockUsers.filter(u => u.id === id);
  },
  
  async insertUser(user) {
    const newUser = {
      id: getNextUserId(),
      ...user,
      created_at: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return { insertId: newUser.id };
  },
  
  async updateUser(id, data) {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...data, updated_at: new Date().toISOString() };
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  },
  
  async deleteUser(id) {
    const initialLength = mockUsers.length;
    mockUsers = mockUsers.filter(u => u.id !== id);
    return { affectedRows: initialLength - mockUsers.length };
  },
  
  // 知识库操作
  async queryKnowledgeList(options) {
    let list = [...mockKnowledge];
    const { category, keyword } = options;
    
    if (category) {
      list = list.filter(k => k.category === category);
    }
    
    if (keyword) {
      const kw = keyword.toLowerCase();
      list = list.filter(k => 
        k.title.toLowerCase().includes(kw) || 
        k.content.toLowerCase().includes(kw) ||
        k.keywords.toLowerCase().includes(kw)
      );
    }
    
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const { page = 1, pageSize = 10 } = options;
    const offset = (page - 1) * pageSize;
    const paginatedList = list.slice(offset, offset + pageSize);
    
    return { list: paginatedList, total: list.length };
  },
  
  async queryKnowledgeById(id) {
    return mockKnowledge.filter(k => k.id === id);
  },
  
  async insertKnowledge(knowledge) {
    const newKnowledge = {
      id: Date.now(),
      ...knowledge,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockKnowledge.push(newKnowledge);
    return { insertId: newKnowledge.id };
  },
  
  async updateKnowledge(id, data) {
    const index = mockKnowledge.findIndex(k => k.id === id);
    if (index !== -1) {
      mockKnowledge[index] = { ...mockKnowledge[index], ...data, updated_at: new Date().toISOString() };
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  },
  
  async deleteKnowledge(id) {
    const initialLength = mockKnowledge.length;
    mockKnowledge = mockKnowledge.filter(k => k.id !== id);
    return { affectedRows: initialLength - mockKnowledge.length };
  },
  
  async searchSimilarKnowledge(queryText, limit = 5) {
    const lowerQuery = queryText.toLowerCase();
    return mockKnowledge
      .map(k => {
        let score = 0;
        if (k.title.toLowerCase().includes(lowerQuery)) score += 0.5;
        if (k.content.toLowerCase().includes(lowerQuery)) score += 0.3;
        if (k.keywords.toLowerCase().includes(lowerQuery)) score += 0.2;
        return { ...k, similarity_score: score };
      })
      .filter(k => k.similarity_score > 0)
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, limit);
  },
  
  // 问题操作
  async insertQuestion(question) {
    const newQuestion = {
      id: getNextQuestionId(),
      ...question,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockQuestions.push(newQuestion);
    return { insertId: newQuestion.id };
  },
  
  async queryQuestionsByUserId(userId, options) {
    let list = mockQuestions.filter(q => q.user_id === userId);
    const { category, status } = options;
    
    if (category) {
      list = list.filter(q => q.category === category);
    }
    if (status) {
      list = list.filter(q => q.status === status);
    }
    
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const { page = 1, pageSize = 10 } = options;
    const offset = (page - 1) * pageSize;
    const paginatedList = list.slice(offset, offset + pageSize);
    
    // 关联回答
    const result = paginatedList.map(q => {
      const answer = mockAnswers.find(a => a.question_id === q.id);
      return {
        ...q,
        answer_content: answer?.content,
        answer_source: answer?.source,
        answer_accuracy: answer?.accuracy
      };
    });
    
    return { list: result, total: list.length };
  },
  
  async queryQuestionByIdAndUserId(questionId, userId) {
    const question = mockQuestions.find(q => q.id === questionId && q.user_id === userId);
    if (!question) return [];
    
    const answer = mockAnswers.find(a => a.question_id === questionId);
    return [{
      ...question,
      answer_content: answer?.content,
      answer_source: answer?.source,
      answer_accuracy: answer?.accuracy,
      answer_created_at: answer?.created_at
    }];
  },
  
  // 回答操作
  async insertAnswer(answer) {
    const newAnswer = {
      id: getNextAnswerId(),
      ...answer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockAnswers.push(newAnswer);
    return { insertId: newAnswer.id };
  },
  
  // 消息操作
  async insertMessage(message) {
    const newMessage = {
      id: getNextMessageId(),
      ...message,
      created_at: new Date().toISOString()
    };
    mockMessages.push(newMessage);
    return { insertId: newMessage.id };
  },
  
  async queryMessagesByUserId(userId, options) {
    let list = mockMessages.filter(m => m.user_id === userId);
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const { page = 1, pageSize = 20 } = options;
    const offset = (page - 1) * pageSize;
    const paginatedList = list.slice(offset, offset + pageSize);
    
    return { list: paginatedList, total: list.length };
  },

  // 登录历史记录操作
  async insertLoginHistory(loginHistory) {
    const newLoginHistory = {
      id: getNextLoginHistoryId(),
      ...loginHistory,
      created_at: new Date().toISOString()
    };
    mockLoginHistory.push(newLoginHistory);
    return { insertId: newLoginHistory.id };
  },

  async queryLoginHistoryByUserId(userId, options = {}) {
    let list = mockLoginHistory.filter(h => h.user_id === userId);
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const { page = 1, pageSize = 20 } = options;
    const offset = (page - 1) * pageSize;
    const paginatedList = list.slice(offset, offset + pageSize);
    
    return { list: paginatedList, total: list.length };
  },

  async queryLoginHistoryById(id) {
    return mockLoginHistory.filter(h => h.id === id);
  },

  async queryAllLoginHistory(options = {}) {
    let list = [...mockLoginHistory];
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const { page = 1, pageSize = 20 } = options;
    const offset = (page - 1) * pageSize;
    const paginatedList = list.slice(offset, offset + pageSize);
    
    return { list: paginatedList, total: list.length };
  }
};

// 真实数据库操作
const realDb = {
  async query(sql, params = []) {
    const { query } = require('./connection');
    return query(sql, params);
  },
  
  async execute(sql, params = []) {
    const { execute } = require('./connection');
    return execute(sql, params);
  }
};

module.exports = {
  USE_MOCK_DB,
  db: USE_MOCK_DB ? mockDb : realDb,
  mockDb,
  realDb
};
