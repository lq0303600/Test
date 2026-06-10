/**
 * 问答模型 - 内存存储版本（无需MySQL）
 */
const questions = [];
const answers = [];

const userCache = {
  1: { username: 'student1', nickname: '小明' },
  2: { username: 'teacher1', nickname: '李老师' },
  3: { username: 'admin', nickname: '管理员' }
};

const QuestionModel = {
  async createTable() {
    return Promise.resolve();
  },

  async createQuestion(data) {
    return new Promise((resolve) => {
      const newQuestion = {
        id: questions.length + 1,
        user_id: data.user_id,
        title: data.title,
        content: data.content,
        category: data.category || 'other',
        status: 'pending',
        priority: data.priority || 'medium',
        assigned_to: null,
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
        updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      questions.push(newQuestion);
      resolve(newQuestion.id);
    });
  },

  async findQuestionById(id) {
    return new Promise((resolve) => {
      const question = questions.find(q => q.id === parseInt(id));
      if (question) {
        const user = userCache[question.user_id];
        resolve({
          ...question,
          username: user?.username || '',
          nickname: user?.nickname || ''
        });
      } else {
        resolve(null);
      }
    });
  },

  async findQuestionsByUserId(userId, options = {}) {
    return new Promise((resolve) => {
      let filtered = questions.filter(q => q.user_id === parseInt(userId));
      
      if (options.status) {
        filtered = filtered.filter(q => q.status === options.status);
      }
      if (options.category) {
        filtered = filtered.filter(q => q.category === options.category);
      }
      
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      const page = options.page || 1;
      const pageSize = options.pageSize || 10;
      const offset = (page - 1) * pageSize;
      const paginated = filtered.slice(offset, offset + pageSize);
      
      const result = paginated.map(q => {
        const answer = answers.find(a => a.question_id === q.id);
        return {
          ...q,
          answer_content: answer?.content || null,
          answer_source: answer?.source || null,
          answer_accuracy: answer?.accuracy || null
        };
      });
      
      resolve({ list: result, total: filtered.length });
    });
  },

  async updateQuestionStatus(id, status, assignedTo = null) {
    return new Promise((resolve) => {
      const question = questions.find(q => q.id === parseInt(id));
      if (question) {
        question.status = status;
        if (assignedTo !== null) {
          question.assigned_to = assignedTo;
        }
        question.updated_at = new Date().toISOString().replace('T', ' ').slice(0, 19);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },

  async createAnswer(data) {
    return new Promise((resolve) => {
      const newAnswer = {
        id: answers.length + 1,
        question_id: data.question_id,
        user_id: data.user_id || null,
        content: data.content,
        source: data.source || 'ai',
        accuracy: data.accuracy || 0.8,
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
      answers.push(newAnswer);
      
      const question = questions.find(q => q.id === parseInt(data.question_id));
      if (question) {
        question.status = 'answered';
        question.updated_at = new Date().toISOString().replace('T', ' ').slice(0, 19);
      }
      
      resolve(newAnswer.id);
    });
  },

  async findAnswersByQuestionId(questionId) {
    return new Promise((resolve) => {
      const questionAnswers = answers.filter(a => a.question_id === parseInt(questionId));
      const result = questionAnswers.map(a => {
        const user = userCache[a.user_id];
        return {
          ...a,
          username: user?.username || '',
          nickname: user?.nickname || ''
        };
      });
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      resolve(result);
    });
  },

  async findPendingQuestions(options = {}) {
    return new Promise((resolve) => {
      let filtered = questions.filter(q => q.status === 'pending');
      
      if (options.priority) {
        filtered = filtered.filter(q => q.priority === options.priority);
      }
      
      filtered.sort((a, b) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.created_at) - new Date(b.created_at);
      });
      
      const page = options.page || 1;
      const pageSize = options.pageSize || 10;
      const offset = (page - 1) * pageSize;
      const paginated = filtered.slice(offset, offset + pageSize);
      
      const result = paginated.map(q => {
        const user = userCache[q.user_id];
        return {
          ...q,
          username: user?.username || '',
          nickname: user?.nickname || ''
        };
      });
      
      resolve(result);
    });
  }
};

module.exports = QuestionModel;