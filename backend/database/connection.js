/**
 * 数据库连接模块
 * 使用mysql2创建连接池
 */
const mysql = require('mysql2/promise');
const config = require('../config/database');

// 创建连接池
const pool = mysql.createPool({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  charset: 'utf8mb4',
  connectionLimit: config.connectionLimit,
  waitForConnections: config.waitForConnections,
  queueLimit: config.queueLimit
});

/**
 * 测试数据库连接
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    connection.release();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1);
  }
}

/**
 * 执行SQL查询
 * @param {string} sql - SQL语句
 * @param {Array} params - 参数数组
 * @returns {Object} - 查询结果
 */
async function query(sql, params = []) {
  const connection = await pool.getConnection();
  try {
    // 确保字符集正确
    await connection.query('SET NAMES utf8mb4');
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('SQL执行错误:', error.message, 'SQL:', sql, 'Params:', params);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 执行SQL语句（插入/更新/删除）
 * @param {string} sql - SQL语句
 * @param {Array} params - 参数数组
 * @returns {Object} - 执行结果
 */
async function execute(sql, params = []) {
  const connection = await pool.getConnection();
  try {
    // 确保字符集正确
    await connection.query('SET NAMES utf8mb4');
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('SQL执行错误:', error.message, 'SQL:', sql, 'Params:', params);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  testConnection,
  query,
  execute
};
