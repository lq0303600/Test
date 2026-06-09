/**
 * AI服务配置文件
 * 包含DeepSeek API相关配置
 */
require('dotenv').config();

module.exports = {
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions',
  model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
  maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 2048,
  timeout: parseInt(process.env.AI_TIMEOUT) || 30000,
  // 知识库检索阈值，低于此值则调用AI
  knowledgeThreshold: parseFloat(process.env.KNOWLEDGE_THRESHOLD) || 0.6
};
