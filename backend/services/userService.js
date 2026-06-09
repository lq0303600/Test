/**
 * 用户服务模块
 * 处理用户相关的业务逻辑
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, USE_MOCK_DB } = require('../database/adapter');
const config = require('../config/app');

/**
 * 用户注册
 * @param {Object} userData - 用户数据
 * @returns {Object} - 创建的用户信息
 */
async function register(userData) {
  const { username, password, nickname, role = 'student' } = userData;
  
  // 检查用户名是否已存在
  const existingUser = USE_MOCK_DB 
    ? await db.queryUserByUsername(username)
    : await db.query(
        'SELECT id FROM users WHERE username = ?',
        [username]
      );
  
  if (existingUser.length > 0) {
    throw new Error('用户名已被注册');
  }
  
  // 加密密码
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // 创建用户
  const result = USE_MOCK_DB
    ? await db.insertUser({ username, password: hashedPassword, nickname: nickname || username, role })
    : await db.execute(
        'INSERT INTO users (username, password, nickname, role) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, nickname || username, role]
      );
  
  // 返回用户信息
  const user = USE_MOCK_DB
    ? await db.queryUserById(result.insertId)
    : await db.query('SELECT id, username, nickname, role, created_at FROM users WHERE id = ?', [result.insertId]);
  
  return user[0];
}

/**
 * 用户登录
 * @param {string} username - 用户名
 * @param {string} password - 用户密码
 * @returns {Object} - 用户信息和token
 */
async function login(username, password) {
  // 查询用户
  const users = USE_MOCK_DB
    ? await db.queryUserByUsername(username)
    : await db.query(
        'SELECT id, username, password, nickname, role FROM users WHERE username = ?',
        [username]
      );
  
  if (users.length === 0) {
    throw new Error('用户名或密码错误');
  }
  
  const user = users[0];
  
  // 验证密码
  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    throw new Error('用户名或密码错误');
  }
  
  // 生成JWT token
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  // 记录登录历史
  try {
    const loginHistory = {
      user_id: user.id,
      username: user.username,
      login_time: new Date().toISOString(),
      ip_address: null, // 可以在中间件中获取
      user_agent: null, // 可以在中间件中获取
      status: 'success'
    };

    if (USE_MOCK_DB) {
      await db.insertLoginHistory(loginHistory);
    } else {
      await db.execute(
        'INSERT INTO login_history (user_id, username, login_time, ip_address, user_agent, status) VALUES (?, ?, ?, ?, ?, ?)',
        [loginHistory.user_id, loginHistory.username, loginHistory.login_time, loginHistory.ip_address, loginHistory.user_agent, loginHistory.status]
      );
    }
  } catch (error) {
    // 登录历史记录失败不影响登录
    console.error('记录登录历史失败:', error.message);
  }
  
  return {
    user: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      role: user.role
    },
    token
  };
}

/**
 * 根据ID获取用户信息
 * @param {number} userId - 用户ID
 * @returns {Object} - 用户信息
 */
async function getUserById(userId) {
  const users = USE_MOCK_DB
    ? await db.queryUserById(userId)
    : await db.query(
        'SELECT id, username, nickname, role, created_at FROM users WHERE id = ?',
        [userId]
      );
  
  if (users.length === 0) {
    throw new Error('用户不存在');
  }
  
  return users[0];
}

/**
 * 更新用户信息
 * @param {number} userId - 用户ID
 * @param {Object} updateData - 更新数据
 * @returns {Object} - 更新后的用户信息
 */
async function updateUser(userId, updateData) {
  const { nickname, avatar } = updateData;
  
  if (!nickname && !avatar) {
    throw new Error('没有需要更新的字段');
  }
  
  if (USE_MOCK_DB) {
    await db.updateUser(userId, { nickname, avatar });
  } else {
    const fields = [];
    const params = [];
    
    if (nickname) {
      fields.push('nickname = ?');
      params.push(nickname);
    }
    
    if (avatar) {
      fields.push('avatar = ?');
      params.push(avatar);
    }
    
    params.push(userId);
    
    await db.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
  }
  
  return await getUserById(userId);
}

/**
 * 删除用户
 * @param {number} userId - 用户ID
 * @returns {boolean} - 删除是否成功
 */
async function deleteUser(userId) {
  const result = USE_MOCK_DB
    ? await db.deleteUser(userId)
    : await db.execute('DELETE FROM users WHERE id = ?', [userId]);
  
  return result.affectedRows > 0;
}

/**
 * 获取用户登录历史
 * @param {number} userId - 用户ID
 * @param {Object} options - 分页选项
 * @returns {Object} - 登录历史列表
 */
async function getLoginHistory(userId, options = {}) {
  const { page = 1, pageSize = 20 } = options;
  
  if (USE_MOCK_DB) {
    const result = await db.queryLoginHistoryByUserId(userId, { page, pageSize });
    return result;
  } else {
    const result = await db.query(
      'SELECT * FROM login_history WHERE user_id = ? ORDER BY login_time DESC LIMIT ? OFFSET ?',
      [userId, pageSize, (page - 1) * pageSize]
    );
    const countResult = await db.query(
      'SELECT COUNT(*) as total FROM login_history WHERE user_id = ?',
      [userId]
    );
    return {
      list: result,
      total: countResult[0].total
    };
  }
}

/**
 * 获取所有登录历史（管理员）
 * @param {Object} options - 分页选项
 * @returns {Object} - 登录历史列表
 */
async function getAllLoginHistory(options = {}) {
  const { page = 1, pageSize = 20 } = options;
  
  if (USE_MOCK_DB) {
    const result = await db.queryAllLoginHistory({ page, pageSize });
    return result;
  } else {
    const result = await db.query(
      'SELECT * FROM login_history ORDER BY login_time DESC LIMIT ? OFFSET ?',
      [pageSize, (page - 1) * pageSize]
    );
    const countResult = await db.query('SELECT COUNT(*) as total FROM login_history');
    return {
      list: result,
      total: countResult[0].total
    };
  }
}

module.exports = {
  register,
  login,
  getUserById,
  updateUser,
  deleteUser,
  getLoginHistory,
  getAllLoginHistory
};
