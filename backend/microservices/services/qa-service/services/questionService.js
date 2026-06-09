const axios = require('axios');
const QuestionModel = require('../models/questionModel');
const config = require('../config/app');

const QuestionService = {
  /**
   * 提交问题
   */
  async submitQuestion(userId, data) {
    const { title, content, category, priority } = data;
    
    // 创建问题
    const questionId = await QuestionModel.createQuestion({
      user_id: userId,
      title,
      content,
      category,
      priority
    });

    // 调用AI服务获取回答
    try {
      await this.processWithAI(questionId, title, content, category);
    } catch (error) {
      console.error('AI处理失败:', error.message);
    }

    return await QuestionModel.findQuestionById(questionId);
  },

  /**
   * 使用AI处理问题
   */
  async processWithAI(questionId, title, content, category) {
    try {
      // 更新状态为处理中
      await QuestionModel.updateQuestionStatus(questionId, 'processing');
      
      // 调用AI服务
      const response = await axios.post(
        `${config.services.aiService}/api/ai/ask`,
        {
          question_id: questionId,
          title,
          content,
          category
        },
        { timeout: 30000 }
      );

      if (response.data.code === 0) {
        const answerData = response.data.data;
        
        // 保存回答
        await QuestionModel.createAnswer({
          question_id: questionId,
          user_id: answerData.user_id,
          content: answerData.content,
          source: answerData.source,
          accuracy: answerData.accuracy
        });

        // 更新问题状态
        if (answerData.source === 'ai' && answerData.accuracy < 0.6) {
          // AI回答准确率低，转接人工
          await QuestionModel.updateQuestionStatus(questionId, 'transferred');
        } else {
          await QuestionModel.updateQuestionStatus(questionId, 'answered');
        }

        // 发送通知
        try {
          await axios.post(
            `${config.services.messageService}/api/messages/notify`,
            {
              user_id: answerData.original_user_id,
              question_id: questionId,
              type: 'ai_answer',
              content: '您的问题已获得AI回答'
            }
          );
        } catch (e) {
          console.error('发送通知失败:', e.message);
        }
      }
    } catch (error) {
      console.error('AI处理错误:', error.message);
      // 如果AI处理失败，保持pending状态
      await QuestionModel.updateQuestionStatus(questionId, 'pending');
    }
  },

  /**
   * 获取问题详情
   */
  async getQuestionById(questionId) {
    const question = await QuestionModel.findQuestionById(questionId);
    if (question) {
      const answers = await QuestionModel.findAnswersByQuestionId(questionId);
      question.answers = answers;
    }
    return question;
  },

  /**
   * 获取用户问答历史
   */
  async getUserQuestions(userId, options) {
    return await QuestionModel.findQuestionsByUserId(userId, options);
  },

  /**
   * 人工回答问题（客服）
   */
  async humanAnswer(questionId, userId, content) {
    // 保存人工回答
    await QuestionModel.createAnswer({
      question_id: questionId,
      user_id: userId,
      content,
      source: 'human',
      accuracy: 1.0
    });

    // 更新状态为已回答
    await QuestionModel.updateQuestionStatus(questionId, 'answered');

    // 通知用户
    const question = await QuestionModel.findQuestionById(questionId);
    try {
      await axios.post(
        `${config.services.messageService}/api/messages/notify`,
        {
          user_id: question.user_id,
          question_id: questionId,
          type: 'human_answer',
          content: '您的问题已获得人工回答'
        }
      );
    } catch (e) {
      console.error('发送通知失败:', e.message);
    }

    return true;
  },

  /**
   * 获取待处理问题列表（客服）
   */
  async getPendingQuestions(options) {
    return await QuestionModel.findPendingQuestions(options);
  },

  /**
   * 转接人工客服
   */
  async transferToHuman(questionId) {
    await QuestionModel.updateQuestionStatus(questionId, 'transferred');
    
    const question = await QuestionModel.findQuestionById(questionId);
    try {
      await axios.post(
        `${config.services.messageService}/api/messages/notify`,
        {
          user_id: question.user_id,
          question_id: questionId,
          type: 'transfer',
          content: '您的问题已转接人工客服'
        }
      );
    } catch (e) {
      console.error('发送通知失败:', e.message);
    }

    return true;
  },

  /**
   * 解决/关闭问题
   */
  async resolveQuestion(questionId, userId) {
    return await QuestionModel.updateQuestionStatus(questionId, 'resolved');
  }
};

module.exports = QuestionService;
