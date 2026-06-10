/**
 * 消息模型 - 内存存储版本（无需MySQL）
 */
const messages = [];

const MessageModel = {
  async createTable() {
    return Promise.resolve();
  },

  async create(data) {
    return new Promise((resolve) => {
      const newMessage = {
        id: messages.length + 1,
        user_id: data.user_id,
        question_id: data.question_id || null,
        type: data.type || 'notification',
        content: data.content,
        is_read: 0,
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      messages.push(newMessage);
      resolve(newMessage.id);
    });
  },

  async findByUserId(userId, options = {}) {
    return new Promise((resolve) => {
      let filtered = messages.filter(m => m.user_id === parseInt(userId));
      
      if (options.is_read !== undefined) {
        filtered = filtered.filter(m => m.is_read === options.is_read);
      }
      
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      const page = options.page || 1;
      const pageSize = options.pageSize || 20;
      const offset = (page - 1) * pageSize;
      const paginated = filtered.slice(offset, offset + pageSize);
      
      const unread = messages.filter(m => m.user_id === parseInt(userId) && m.is_read === 0).length;
      
      resolve({ list: paginated, unread });
    });
  },

  async markAsRead(id, userId) {
    return new Promise((resolve) => {
      const message = messages.find(m => m.id === parseInt(id) && m.user_id === parseInt(userId));
      if (message) {
        message.is_read = 1;
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },

  async markAllAsRead(userId) {
    return new Promise((resolve) => {
      let count = 0;
      messages.forEach(m => {
        if (m.user_id === parseInt(userId) && m.is_read === 0) {
          m.is_read = 1;
          count++;
        }
      });
      resolve(count);
    });
  },

  async delete(id, userId) {
    return new Promise((resolve) => {
      const index = messages.findIndex(m => m.id === parseInt(id) && m.user_id === parseInt(userId));
      if (index !== -1) {
        messages.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
};

module.exports = MessageModel;