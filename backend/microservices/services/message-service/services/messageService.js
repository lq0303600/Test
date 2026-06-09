const MessageModel = require('../models/messageModel');

const MessageService = {
  /**
   * 发送通知
   */
  async sendNotification(data) {
    const { user_id, question_id, type, content } = data;
    
    // 保存消息
    const messageId = await MessageModel.create({
      user_id,
      question_id,
      type: type || 'notification',
      content
    });

    // TODO: 通过WebSocket推送实时通知
    this.pushToUser(user_id, {
      id: messageId,
      type,
      content,
      question_id
    });

    return messageId;
  },

  /**
   * 获取用户消息列表
   */
  async getUserMessages(userId, options) {
    return await MessageModel.findByUserId(userId, options);
  },

  /**
   * 标记消息为已读
   */
  async markAsRead(messageId, userId) {
    return await MessageModel.markAsRead(messageId, userId);
  },

  /**
   * 标记所有消息为已读
   */
  async markAllAsRead(userId) {
    return await MessageModel.markAllAsRead(userId);
  },

  /**
   * 删除消息
   */
  async deleteMessage(messageId, userId) {
    return await MessageModel.delete(messageId, userId);
  },

  /**
   * 推送消息到指定用户（WebSocket）
   */
  pushToUser(userId, data) {
    // 这里可以通过WebSocket或Redis Pub/Sub推送
    // 简化实现，实际使用时需要集成Socket.io
    console.log(`推送消息到用户 ${userId}:`, data);
    return true;
  },

  /**
   * 发送AI回答通知
   */
  async notifyAIAnswer(userId, questionId, answerContent) {
    return await this.sendNotification({
      user_id: userId,
      question_id: questionId,
      type: 'ai_answer',
      content: '您的问题已获得AI智能回答'
    });
  },

  /**
   * 发送人工回答通知
   */
  async notifyHumanAnswer(userId, questionId) {
    return await this.sendNotification({
      user_id: userId,
      question_id: questionId,
      type: 'human_answer',
      content: '您的问题已获得人工回复'
    });
  },

  /**
   * 发送转接通知
   */
  async notifyTransfer(userId, questionId) {
    return await this.sendNotification({
      user_id: userId,
      question_id: questionId,
      type: 'transfer',
      content: '您的问题已转接人工客服'
    });
  }
};

module.exports = MessageService;
