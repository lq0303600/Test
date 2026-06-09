/**
 * 响应工具模块
 * 提供统一的API响应格式
 */

/**
 * 成功响应
 * @param {Object} res - Express响应对象
 * @param {any} data - 返回数据
 * @param {string} message - 响应消息
 * @param {number} statusCode - HTTP状态码
 */
function success(res, data = null, message = '操作成功', statusCode = 200) {
  res.status(statusCode).json({
    code: 0,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

/**
 * 失败响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @param {number} statusCode - HTTP状态码
 * @param {any} data - 附加数据
 */
function error(res, message = '操作失败', statusCode = 400, data = null) {
  res.status(statusCode).json({
    code: statusCode,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

/**
 * 分页响应
 * @param {Object} res - Express响应对象
 * @param {Array} list - 数据列表
 * @param {number} total - 总记录数
 * @param {number} page - 当前页码
 * @param {number} pageSize - 每页大小
 */
function paginate(res, list = [], total = 0, page = 1, pageSize = 10) {
  res.status(200).json({
    code: 0,
    message: '操作成功',
    data: {
      list,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    },
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  success,
  error,
  paginate
};
