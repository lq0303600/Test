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

const MessageModel = {
  async createTable() {
    const conn = await getPool().getConnection();
    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          question_id INT,
          type ENUM('question', 'answer', 'system', 'notification') DEFAULT 'question',
          content TEXT NOT NULL,
          is_read TINYINT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_user_id (user_id),
          INDEX idx_question_id (question_id),
          INDEX idx_is_read (is_read)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      
      console.log('消息表创建成功');
    } finally {
      conn.release();
    }
  },

  async create(data) {
    const conn = await getPool().getConnection();
    try {
      const [result] = await conn.execute(
        'INSERT INTO messages (user_id, question_id, type, content) VALUES (?, ?, ?, ?)',
        [data.user_id, data.question_id || null, data.type || 'notification', data.content]
      );
      return result.insertId;
    } finally {
      conn.release();
    }
  },

  async findByUserId(userId, options = {}) {
    const conn = await getPool().getConnection();
    try {
      let sql = 'SELECT * FROM messages WHERE user_id = ?';
      const params = [userId];
      
      if (options.is_read !== undefined) {
        sql += ' AND is_read = ?';
        params.push(options.is_read);
      }
      
      sql += ' ORDER BY created_at DESC';
      
      const page = options.page || 1;
      const pageSize = options.pageSize || 20;
      const offset = (page - 1) * pageSize;
      
      sql += ` LIMIT ${pageSize} OFFSET ${offset}`;
      
      const [rows] = await conn.execute(sql, params);
      
      // 获取未读数量
      const [countResult] = await conn.execute(
        'SELECT COUNT(*) as unread FROM messages WHERE user_id = ? AND is_read = 0',
        [userId]
      );
      
      return {
        list: rows,
        unread: countResult[0]?.unread || 0
      };
    } finally {
      conn.release();
    }
  },

  async markAsRead(id, userId) {
    const conn = await getPool().getConnection();
    try {
      const [result] = await conn.execute(
        'UPDATE messages SET is_read = 1 WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  },

  async markAllAsRead(userId) {
    const conn = await getPool().getConnection();
    try {
      const [result] = await conn.execute(
        'UPDATE messages SET is_read = 1 WHERE user_id = ? AND is_read = 0',
        [userId]
      );
      return result.affectedRows;
    } finally {
      conn.release();
    }
  },

  async delete(id, userId) {
    const conn = await getPool().getConnection();
    try {
      const [result] = await conn.execute(
        'DELETE FROM messages WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }
};

module.exports = MessageModel;
