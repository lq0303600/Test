module.exports = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'campus-qa-secret-key-2024',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
