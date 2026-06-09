const mysql = require('mysql2/promise');
const config = require('../config/app');

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...config.db,
      charset: 'utf8mb4',
      connectionLimit: 10
    });
  }
  return pool;
}

const QuestionModel = {
  async createTable() {
    const conn = await getPool().getConnection();
    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS questions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          title VARCHAR(200) NOT NULL,
          content TEXT NOT NULL,
          category ENUM('admission', 'academic', 'campus', 'career', 'life', 'other') DEFAULT 'other',
          status ENUM('pending', 'processing', 'answered', 'resolved', 'transferred') DEFAULT 'pending',
          priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
          assigned_to INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_user_id (user_id),
          INDEX idx_status (status),
          INDEX idx_category (category)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      
      await conn.query(`
        CREATE TABLE IF NOT EXISTS answers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          question_id INT NOT NULL,
          user_id INT,
          content TEXT NOT NULL,
          source ENUM('knowledge_base', 'ai', 'human') DEFAULT 'ai',
          accuracy DECIMAL(3,2) DEFAULT 0.8,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_question_id (question_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      
      console.log('问答表创建成功');
    } finally {
      conn.release();
    }
  },

  async createQuestion(data) {
    const conn = await getPool().getConnection();
    try {
      const [result] = await conn.execute(
        'INSERT INTO questions (user_id, title, content, category, priority) VALUES (?, ?, ?, ?, ?)',
        [data.user_id, data.title, data.content, data.category || 'other', data.priority || 'medium']
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  },

  async findQuestionById(id) {
    const conn = await getPool().getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT q.*, u.username, u.nickname FROM questions q LEFT JOIN users u ON q.user_id = u.id WHERE q.id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      conn.release();
    }
  },

  async findQuestionsByUserId(userId, options = {}) {
    const conn = await getPool().getConnection();
    try {
      let sql = 'SELECT q.*, a.content as answer_content, a.source as answer_source, a.accuracy as answer_accuracy FROM questions q LEFT JOIN answers a ON q.id = a.question_id WHERE q.user_id = ?';
      const params = [userId];
      
      if (options.status) {
        sql += ' AND q.status = ?';
        params.push(options.status);
      }
      if (options.category) {
        sql += ' AND q.category = ?';
        params.push(options.category);
      }
      
      sql += ' ORDER BY q.created_at DESC';
      
      const page = options.page || 1;
      const pageSize = options.pageSize || 10;
      const offset = (page - 1) * pageSize;
      
      sql += ` LIMIT ${pageSize} OFFSET ${offset}`;
      
      const [rows] = await conn.execute(sql, params);
      
      // 获取总数
      const [countResult] = await conn.execute(
        'SELECT COUNT(*) as total FROM questions WHERE user_id = ?',
        [userId]
      );
      
      return { list: rows, total: countResult[0]?.total || 0 };
    } finally {
      conn.release();
    }
  },

  async updateQuestionStatus(id, status, assignedTo = null) {
    const conn = await getPool().getConnection();
    try {
      let sql = 'UPDATE questions SET status = ?';
      const params = [status];
      
      if (assignedTo) {
        sql += ', assigned_to = ?';
        params.push(assignedTo);
      }
      
      sql += ' WHERE id = ?';
      params.push(id);
      
      const [result] = await conn.execute(sql, params);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  },

  async createAnswer(data) {
    const conn = await getPool().getConnection();
    try {
      const [result] = await conn.execute(
        'INSERT INTO answers (question_id, user_id, content, source, accuracy) VALUES (?, ?, ?, ?, ?)',
        [data.question_id, data.user_id, data.content, data.source, data.accuracy || 0.8]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  },

  async findAnswersByQuestionId(questionId) {
    const conn = await getPool().getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT a.*, u.username, u.nickname FROM answers a LEFT JOIN users u ON a.user_id = u.id WHERE a.question_id = ? ORDER BY a.created_at DESC',
        [questionId]
      );
      return rows;
    } finally {
      conn.release();
    }
  },

  async findPendingQuestions(options = {}) {
    const conn = await getPool().getConnection();
    try {
      let sql = 'SELECT q.*, u.username, u.nickname FROM questions q LEFT JOIN users u ON q.user_id = u.id WHERE q.status = "pending"';
      
      if (options.priority) {
        sql += ' AND q.priority = ?';
      }
      
      sql += ' ORDER BY CASE q.priority WHEN "high" THEN 1 WHEN "medium" THEN 2 WHEN "low" THEN 3 END, q.created_at ASC';
      
      const page = options.page || 1;
      const pageSize = options.pageSize || 10;
      const offset = (page - 1) * pageSize;
      
      sql += ` LIMIT ${pageSize} OFFSET ${offset}`;
      
      const [rows] = await conn.execute(sql, options.priority ? [options.priority] : []);
      return rows;
    } finally {
      conn.release();
    }
  }
};

module.exports = QuestionModel;
