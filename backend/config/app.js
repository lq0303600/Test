/**
 * 应用配置文件
 * 包含Express应用相关配置
 */
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 9081,
  jwtSecret: process.env.JWT_SECRET || 'campus_qa_jwt_secret_key_2024',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  environment: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info'
};
