const MessageService = require('../services/messageService');

const MessageController = {
  /**
   * 发送通知
   */
  async notify(req, res) {
    try {
      const { user_id, question_id, type, content } = req.body;
      const messageId = await MessageService.sendNotification({
        user_id,
        question_id,
        type,
        content
      });
      res.json({ code: 0, message: '通知已发送', data: { id: messageId } });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  /**
   * 获取消息列表
   */
  async getUserMessages(req, res) {
    try {
      const { page = 1, pageSize = 20, is_read } = req.query;
      const result = await MessageService.getUserMessages(req.user.userId, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        is_read: is_read !== undefined ? parseInt(is_read) : undefined
      });
      res.json({ code: 0, data: result });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  /**
   * 标记消息为已读
   */
  async markAsRead(req, res) {
    try {
      const success = await MessageService.markAsRead(req.params.id, req.user.userId);
      if (!success) {
        return res.status(404).json({ code: 404, message: '消息不存在' });
      }
      res.json({ code: 0, message: '已标记为已读' });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  /**
   * 标记所有消息为已读
   */
  async markAllAsRead(req, res) {
    try {
      const count = await MessageService.markAllAsRead(req.user.userId);
      res.json({ code: 0, message: `已标记 ${count} 条消息为已读` });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  /**
   * 删除消息
   */
  async deleteMessage(req, res) {
    try {
      const success = await MessageService.deleteMessage(req.params.id, req.user.userId);
      if (!success) {
        return res.status(404).json({ code: 404, message: '消息不存在' });
      }
      res.json({ code: 0, message: '消息已删除' });
    } catch (error) {
      res.status(500).json({ code: 500, message: error.message });
    }
  }
};

module.exports = MessageController;
