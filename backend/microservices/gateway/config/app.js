module.exports = {
  port: process.env.PORT || 8080,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Lq200603',
    database: process.env.DB_NAME || 'campus_qa_platform'
  },
  services: {
    userService: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    knowledgeService: process.env.KNOWLEDGE_SERVICE_URL || 'http://localhost:3002',
    qaService: process.env.QA_SERVICE_URL || 'http://localhost:3003',
    aiService: process.env.AI_SERVICE_URL || 'http://localhost:3004',
    messageService: process.env.MESSAGE_SERVICE_URL || 'http://localhost:3005'
  }
};
