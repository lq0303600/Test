module.exports = {
  port: process.env.PORT || 3002,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Lq200603',
    database: process.env.DB_NAME || 'campus_qa_platform'
  }
};
