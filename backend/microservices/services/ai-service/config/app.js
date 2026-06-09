module.exports = {
  port: process.env.PORT || 3004,
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || 'sk-86165900516a4017a61aaaf062cfd73c',
  deepseekApiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
  knowledgeServiceUrl: process.env.KNOWLEDGE_SERVICE_URL || 'http://localhost:3002',
  confidenceThreshold: 0.6 // 低于此阈值转人工
};
