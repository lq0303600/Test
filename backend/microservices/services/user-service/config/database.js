module.exports = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'L请00603',
  database: process.env.DB_NAME || 'campus_qa_platform',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
};
