/**
 * 参数验证中间件模块
 * 提供常见的参数验证功能
 */
const response = require('../utils/response');

/**
 * 验证用户注册参数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - 下一个中间件
 */
function validateRegister(req, res, next) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return response.error(res, '用户名和密码都是必填项', 400);
  }
  
  if (username.length < 3 || username.length > 50) {
    return response.error(res, '用户名长度必须在3-50个字符之间', 400);
  }
  
  if (password.length < 6) {
    return response.error(res, '密码长度至少为6个字符', 400);
  }
  
  next();
}

/**
 * 验证用户登录参数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - 下一个中间件
 */
function validateLogin(req, res, next) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return response.error(res, '用户名和密码都是必填项', 400);
  }
  
  next();
}

/**
 * 验证问题提交参数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - 下一个中间件
 */
function validateQuestion(req, res, next) {
  const { title, content, question } = req.body;
  
  // 支持两种格式：question字段（AI问答）或 title+content字段（问题发布）
  if (question) {
    // AI问答格式
    if (question.length > 2000) {
      return response.error(res, '问题长度不能超过2000个字符', 400);
    }
  } else if (!title || !content) {
    // 问题发布格式
    return response.error(res, '问题标题和内容都是必填项', 400);
  } else {
    if (title.length > 200) {
      return response.error(res, '问题标题长度不能超过200个字符', 400);
    }
    
    if (content.length > 2000) {
      return response.error(res, '问题内容长度不能超过2000个字符', 400);
    }
  }
  
  next();
}

/**
 * 验证知识库创建参数
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - 下一个中间件
 */
function validateKnowledge(req, res, next) {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return response.error(res, '标题和内容都是必填项', 400);
  }
  
  if (title.length > 200) {
    return response.error(res, '标题长度不能超过200个字符', 400);
  }
  
  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateQuestion,
  validateKnowledge
};
