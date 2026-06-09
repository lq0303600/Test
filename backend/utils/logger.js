/**
 * 日志工具模块
 * 提供统一的日志记录功能
 */
const config = require('../config/app');

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const currentLevel = LOG_LEVELS[config.logLevel] || LOG_LEVELS.info;

function log(level, message, ...args) {
  if (LOG_LEVELS[level] < currentLevel) return;
  
  const timestamp = new Date().toISOString();
  const colorMap = {
    debug: '\x1b[36m',
    info: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m'
  };
  const reset = '\x1b[0m';
  
  console.log(`${colorMap[level]}[${timestamp}] [${level.toUpperCase()}] ${message}${reset}`, ...args);
}

const logger = {
  debug: (message, ...args) => log('debug', message, ...args),
  info: (message, ...args) => log('info', message, ...args),
  warn: (message, ...args) => log('warn', message, ...args),
  error: (message, ...args) => log('error', message, ...args)
};

module.exports = logger;
