const axios = require('axios');
const config = require('../config/app');

// 完整数据库表数据（从前端导入的真实数据）
const campusDatabase = {
  notices: [
    { id: 1, title: '2026年秋季学期选课通知', content: '各位同学，2026年秋季学期选课将于6月15日开始，请提前做好选课准备。', type: 'academic', author: '教务处', date: '2026-06-05' },
    { id: 2, title: '图书馆暑假开放安排', content: '暑假期间图书馆开放时间调整如下：主馆周一至周五8:00-18:00；分馆周一至周五9:00-17:00。', type: 'logistics', author: '图书馆', date: '2026-06-04' },
    { id: 3, title: '2026届毕业生就业双选会', content: '我校将于6月20日举办2026届毕业生就业双选会，届时将有150余家企业参会。', type: 'student_affairs', author: '就业指导中心', date: '2026-06-03' },
    { id: 4, title: '计算机学院学术讲座：人工智能前沿', content: '邀请清华大学张教授来我校作题为"大语言模型的最新进展与应用"的学术讲座。时间：6月18日14:00，地点：学术报告厅。', type: 'research', author: '计算机学院', date: '2026-06-02' },
    { id: 5, title: '校园一卡通系统升级通知', content: '校园一卡通系统将于6月10日凌晨进行系统升级，届时暂停使用1小时。', type: 'logistics', author: '信息中心', date: '2026-06-01' },
    { id: 6, title: '心理健康教育活动通知', content: '学生处将于6月举办"阳光心灵"心理健康教育系列活动，包括心理讲座、团体辅导等。', type: 'student_affairs', author: '学生处', date: '2026-05-31' },
    { id: 7, title: '运动会报名通知', content: '学校第28届田径运动会将于10月举行，即日起开始报名。', type: 'activity', author: '体育学院', date: '2026-05-30' },
    { id: 8, title: '期末考试安排', content: '2026年春季学期期末考试将于7月5日-15日进行，请同学们认真复习备考。', type: 'academic', author: '教务处', date: '2026-05-29' }
  ],
  books: [
    { id: 1, title: '数据结构与算法', author: '严蔚敏', publisher: '清华大学出版社', category: '计算机', available: 8, location: 'A区2楼' },
    { id: 2, title: '算法导论', author: 'Thomas H.Cormen', publisher: '机械工业出版社', category: '计算机', available: 4, location: 'A区2楼' },
    { id: 3, title: '计算机网络', author: '谢希仁', publisher: '电子工业出版社', category: '计算机', available: 12, location: 'A区2楼' },
    { id: 4, title: '人工智能导论', author: '李航', publisher: '清华大学出版社', category: '计算机', available: 7, location: 'A区3楼' },
    { id: 5, title: 'Python编程从入门到实践', author: 'Eric Matthes', publisher: '人民邮电出版社', category: '计算机', available: 18, location: 'A区2楼' },
    { id: 6, title: '深入理解计算机系统', author: 'Randal E.Bryant', publisher: '机械工业出版社', category: '计算机', available: 3, location: 'A区3楼' },
    { id: 7, title: '红楼梦', author: '曹雪芹', publisher: '人民文学出版社', category: '文学', available: 22, location: 'B区1楼' },
    { id: 8, title: '三体', author: '刘慈欣', publisher: '重庆出版社', category: '文学', available: 35, location: 'B区1楼' },
    { id: 9, title: '高等数学', author: '同济大学数学系', publisher: '高等教育出版社', category: '数学', available: 25, location: 'C区1楼' },
    { id: 10, title: '线性代数及其应用', author: 'Gilbert Strang', publisher: '机械工业出版社', category: '数学', available: 10, location: 'C区1楼' }
  ],
  activities: [
    { id: 1, title: '校园歌手大赛', description: '一年一度的校园歌手大赛开始啦！展示你的音乐才华，赢取丰厚奖品！', time: '2026-06-15 19:00', location: '大学生活动中心', organizer: '学生会', participants: 32, max: 50 },
    { id: 2, title: '编程马拉松', description: '48小时编程挑战，与队友一起完成项目，展示你的技术实力！', time: '2026-06-20 09:00', location: '计算机学院实验楼', organizer: '计算机学院', participants: 25, max: 40 },
    { id: 3, title: '读书分享会', description: '一起分享阅读的快乐，交流读书心得，结交志同道合的朋友！', time: '2026-06-18 14:00', location: '图书馆报告厅', organizer: '读书协会', participants: 28, max: 30 },
    { id: 4, title: '志愿者招募', description: '校园志愿服务团队招募新成员，参与校园公益活动！', time: '2026-06-10 08:00', location: '线上报名', organizer: '志愿者协会', participants: 67, max: 100 },
    { id: 5, title: '毕业季主题摄影展', description: '记录校园美好时光，展示毕业生风采！', time: '2026-06-01 09:00', location: '艺术楼展厅', organizer: '艺术学院', participants: 0, max: 0 }
  ],
  lost_found: [
    { id: 1, item: '黑色钱包', description: '黑色皮质钱包，内有身份证、银行卡和现金若干', type: 'lost', location: '图书馆二楼', phone: '13800138001' },
    { id: 2, item: '蓝色保温杯', description: '象印蓝色保温杯，500ml容量', type: 'found', location: '第一食堂', phone: '13900139001' },
    { id: 3, item: '眼镜盒', description: '黑色眼镜盒，内有近视眼镜一副', type: 'lost', location: '教学楼A座', phone: '13800138001' },
    { id: 4, item: 'U盘', description: '金士顿红色U盘，32G，印有校徽', type: 'found', location: '图书馆服务台', phone: '13700137001' }
  ],
  canteen_menus: [
    { id: 1, canteen: '第一食堂', window: '1号窗口', dish: '红烧肉套餐', price: 15.00, meal: 'lunch' },
    { id: 2, canteen: '第一食堂', window: '1号窗口', dish: '宫保鸡丁套餐', price: 12.00, meal: 'lunch' },
    { id: 3, canteen: '第一食堂', window: '2号窗口', dish: '牛肉面', price: 10.00, meal: 'lunch' },
    { id: 4, canteen: '第一食堂', window: '3号窗口', dish: '包子', price: 1.50, meal: 'breakfast' },
    { id: 5, canteen: '第二食堂', window: '1号窗口', dish: '酸菜鱼', price: 18.00, meal: 'lunch' },
    { id: 6, canteen: '第二食堂', window: '1号窗口', dish: '糖醋排骨', price: 20.00, meal: 'lunch' },
    { id: 7, canteen: '第三食堂', window: '清真窗口', dish: '手抓饭', price: 15.00, meal: 'lunch' },
    { id: 8, canteen: '第三食堂', window: '清真窗口', dish: '拉面', price: 10.00, meal: 'lunch' }
  ],
  dormitories: [
    { id: 1, building: '3号楼', room: '301', floor: 3, capacity: 4, residents: 4, gender: 'male' },
    { id: 2, building: '3号楼', room: '302', floor: 3, capacity: 4, residents: 3, gender: 'male' },
    { id: 3, building: '4号楼', room: '205', floor: 2, capacity: 4, residents: 4, gender: 'female' },
    { id: 4, building: '4号楼', room: '206', floor: 2, capacity: 4, residents: 2, gender: 'female' },
    { id: 5, building: '5号楼', room: '101', floor: 1, capacity: 2, residents: 2, gender: 'male' }
  ]
};

/**
 * AI智能问答服务
 * 核心功能：
 * 1. RAG检索增强问答
 * 2. 用户问题意图识别
 * 3. 自动问题分类
 * 4. 智能答复
 * 5. 无法解答自动转接人工客服
 */
const AIService = {
  /**
   * 处理用户问题
   */
  async processQuestion(questionData) {
    const { question_id, title, content, category } = questionData;
    const question = content || title;

    try {
      // 1. 意图识别
      const intent = await this.recognizeIntent(question);
      console.log('意图识别结果:', intent);

      // 2. 自动分类（如果没有提供分类）
      let finalCategory = category;
      if (!finalCategory) {
        finalCategory = await this.classifyQuestion(question);
        console.log('问题分类结果:', finalCategory);
      }

      // 3. RAG检索 - 从知识库获取相关内容
      const knowledgeResults = await this.ragRetrieve(question);
      console.log('RAG检索结果:', knowledgeResults.length, '条');

      // 4. 生成回答
      const answer = await this.generateAnswer(question, knowledgeResults, intent);

      // 5. 评估回答质量
      const quality = await this.evaluateAnswerQuality(answer, question, knowledgeResults);

      // 6. 如果回答质量低，转接人工
      if (quality.confidence < config.confidenceThreshold) {
        return {
          content: answer.content,
          source: 'ai',
          accuracy: quality.confidence,
          needTransfer: true,
          reason: 'AI回答置信度较低，建议人工介入'
        };
      }

      return {
        content: answer.content,
        source: 'ai',
        accuracy: quality.confidence,
        intent: intent,
        category: finalCategory,
        knowledge_used: knowledgeResults.length > 0,
        needTransfer: false
      };
    } catch (error) {
      console.error('AI处理失败:', error);
      throw error;
    }
  },

  /**
   * 意图识别
   */
  async recognizeIntent(question) {
    const intents = {
      '咨询': ['怎么', '如何', '请问', '问一下', '咨询'],
      '查询': ['在哪里', '多少', '几点', '什么时候', '查询'],
      '申请': ['申请', '报名', '注册'],
      '办理': ['怎么办理', '如何办理', '流程'],
      '投诉': ['投诉', '反馈', '建议', '不满']
    };

    let maxScore = 0;
    let detectedIntent = '咨询';

    for (const [intent, keywords] of Object.entries(intents)) {
      const score = keywords.filter(kw => question.includes(kw)).length;
      if (score > maxScore) {
        maxScore = score;
        detectedIntent = intent;
      }
    }

    return {
      type: detectedIntent,
      confidence: Math.min(maxScore / 2, 1.0)
    };
  },

  /**
   * 问题分类
   */
  async classifyQuestion(question) {
    const categories = {
      'admission': ['入学', '录取', '报到', '新生', '招生'],
      'academic': ['选课', '学分', '成绩', '考试', '毕业', '论文', '奖学金', '转专业', '绩点'],
      'campus': ['图书馆', '校园', '卡', '充值', '设施'],
      'career': ['就业', '实习', '简历', '招聘', '工作'],
      'life': ['宿舍', '食堂', '餐饮', '生活', '门禁']
    };

    let maxScore = 0;
    let category = 'other';

    for (const [cat, keywords] of Object.entries(categories)) {
      const score = keywords.filter(kw => question.includes(kw)).length;
      if (score > maxScore) {
        maxScore = score;
        category = cat;
      }
    }

    return category;
  },

  /**
   * RAG检索
   */
  async ragRetrieve(question, limit = 5) {
    try {
      const response = await axios.get(
        `${config.knowledgeServiceUrl}/api/knowledge/search`,
        {
          params: { q: question, limit },
          timeout: 5000
        }
      );

      if (response.data.code === 0) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('RAG检索失败:', error.message);
      return [];
    }
  },

  /**
   * 生成回答
   */
  async generateAnswer(question, knowledgeResults, intent) {
    // 构建提示词
    let context = '';
    if (knowledgeResults.length > 0) {
      context = '参考知识库内容：\n';
      knowledgeResults.forEach((kb, index) => {
        context += `${index + 1}. ${kb.title}: ${kb.content}\n`;
      });
      context += '\n';
    }

    const prompt = `${context}用户问题：${question}

请根据上述内容，提供一个准确、友好的回答。如果知识库中有相关信息，请优先使用知识库内容回答。`;

    // 调用DeepSeek API
    try {
      const response = await axios.post(
        config.deepseekApiUrl,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一个校园智能问答助手，负责回答学生关于学校的各类问题。请用友好、专业的语气回答问题。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.deepseekApiKey}`
          },
          timeout: 30000
        }
      );

      const answer = response.data.choices[0]?.message?.content || '抱歉，我暂时无法回答这个问题，建议您联系人工客服。';
      
      return {
        content: answer,
        model: 'deepseek-chat'
      };
    } catch (error) {
      console.error('DeepSeek API调用失败:', error.message);
      
      // 如果API调用失败，使用知识库内容作为后备
      if (knowledgeResults.length > 0) {
        const kb = knowledgeResults[0];
        return {
          content: `根据知识库内容，关于您的问题回答如下：\n\n${kb.content}\n\n如果还有其他问题，欢迎继续提问！`,
          model: 'knowledge-base-fallback'
        };
      }

      return {
        content: '抱歉，AI服务暂时不可用。请稍后再试，或联系人工客服获取帮助。',
        model: 'fallback'
      };
    }
  },

  /**
   * 评估回答质量
   */
  async evaluateAnswerQuality(answer, question, knowledgeResults) {
    let confidence = 0.5;

    // 如果使用了知识库内容，增加置信度
    if (knowledgeResults.length > 0) {
      // 检查回答是否包含知识库内容
      const kbContent = knowledgeResults.map(kb => kb.content).join(' ');
      const similarity = this.calculateSimilarity(answer.content, kbContent);
      confidence = Math.max(confidence, similarity * 0.9);
    }

    // 如果是API回答，置信度更高
    if (answer.model === 'deepseek-chat') {
      confidence = Math.min(confidence + 0.3, 0.95);
    }

    // 检查回答长度
    if (answer.content.length < 20) {
      confidence = Math.max(confidence - 0.2, 0.3);
    }

    return {
      confidence: Math.round(confidence * 100) / 100,
      isReliable: confidence >= config.confidenceThreshold
    };
  },

  /**
   * 计算文本相似度（简化版）
   */
  calculateSimilarity(text1, text2) {
    const words1 = new Set(text1.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').split(''));
    const words2 = new Set(text2.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').split(''));
    
    const intersection = [...words1].filter(x => words2.has(x)).length;
    const union = new Set([...words1, ...words2]).size;
    
    return union > 0 ? intersection / union : 0;
  },

  /**
   * 搜索融合 - 同时进行AI问答和信息检索
   */
  async searchAndAsk(question, searchType = 'combined') {
    try {
      // 1. 从所有表中搜索数据（作为上下文参考）
      const searchResults = this.searchAllTables(question);
      
      // 2. 优先调用DeepSeek API生成AI回答（真正的大语言模型）
      let answer;
      let apiSuccess = true;
      try {
        answer = await this.callDeepSeekWithContext(question, searchResults);
      } catch (e) {
        console.log('DeepSeek API调用失败:', e.message);
        apiSuccess = false;
        answer = this.generateAnswerFromData(question, searchResults);
      }
      
      // 3. 整合结果
      return {
        answer: answer,
        searchResults: searchResults,
        confidence: apiSuccess ? 0.9 : (searchResults.length > 0 ? 0.7 : 0.5),
        intent: this.recognizeIntent(question),
        category: this.categorizeQuestion(question),
        knowledgeUsed: searchResults.length > 0,
        aiModelUsed: apiSuccess ? 'deepseek-chat' : 'local-fallback'
      };
    } catch (error) {
      console.error('搜索融合失败:', error);
      return {
        answer: '抱歉，处理您的问题时发生错误，请稍后再试。',
        searchResults: [],
        confidence: 0.3,
        intent: { type: '咨询', confidence: 0.3 },
        category: 'other',
        knowledgeUsed: false,
        aiModelUsed: 'error'
      };
    }
  },

  /**
   * 从所有表中搜索数据
   */
  searchAllTables(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    // 搜索通知公告
    campusDatabase.notices.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery) || 
          item.content.toLowerCase().includes(lowerQuery) ||
          item.author.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: item.id,
          title: item.title,
          summary: item.content.substring(0, 150),
          type: 'notice',
          source: '通知公告',
          date: item.date,
          relevance: this.calculateRelevance(query, item.title + ' ' + item.content)
        });
      }
    });
    
    // 搜索图书
    campusDatabase.books.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery) || 
          item.author.toLowerCase().includes(lowerQuery) ||
          item.publisher.toLowerCase().includes(lowerQuery) ||
          item.category.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: item.id,
          title: item.title,
          summary: `作者：${item.author} | 出版社：${item.publisher} | 位置：${item.location} | 库存：${item.available}本`,
          type: 'book',
          source: '图书资源',
          date: '',
          relevance: this.calculateRelevance(query, item.title + ' ' + item.author)
        });
      }
    });
    
    // 搜索活动
    campusDatabase.activities.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery) || 
          item.description.toLowerCase().includes(lowerQuery) ||
          item.location.toLowerCase().includes(lowerQuery) ||
          item.organizer.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: item.id,
          title: item.title,
          summary: `${item.description} | 时间：${item.time} | 地点：${item.location} | 已报名：${item.participants}/${item.max}`,
          type: 'activity',
          source: '校园活动',
          date: item.time,
          relevance: this.calculateRelevance(query, item.title + ' ' + item.description)
        });
      }
    });
    
    // 搜索失物招领
    campusDatabase.lost_found.forEach(item => {
      if (item.item.toLowerCase().includes(lowerQuery) || 
          item.description.toLowerCase().includes(lowerQuery) ||
          item.location.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: item.id,
          title: `${item.type === 'lost' ? '【失物】' : '【招领】'}${item.item}`,
          summary: `${item.description} | 地点：${item.location} | 联系电话：${item.phone}`,
          type: 'lost_found',
          source: '失物招领',
          date: '',
          relevance: this.calculateRelevance(query, item.item + ' ' + item.description)
        });
      }
    });
    
    // 搜索食堂菜单
    campusDatabase.canteen_menus.forEach(item => {
      if (item.canteen.toLowerCase().includes(lowerQuery) || 
          item.dish.toLowerCase().includes(lowerQuery) ||
          item.window.toLowerCase().includes(lowerQuery)) {
        const mealType = item.meal === 'lunch' ? '午餐' : item.meal === 'dinner' ? '晚餐' : '早餐';
        results.push({
          id: item.id,
          title: `${item.canteen} - ${item.dish}`,
          summary: `${item.window} | 餐次：${mealType} | 价格：¥${item.price.toFixed(2)}`,
          type: 'canteen',
          source: '食堂菜单',
          date: '',
          relevance: this.calculateRelevance(query, item.dish + ' ' + item.canteen)
        });
      }
    });
    
    // 搜索宿舍
    campusDatabase.dormitories.forEach(item => {
      if (item.building.toLowerCase().includes(lowerQuery) || 
          item.room.toLowerCase().includes(lowerQuery)) {
        const gender = item.gender === 'male' ? '男生' : '女生';
        results.push({
          id: item.id,
          title: `${item.building} ${item.room}室`,
          summary: `楼层：${item.floor}楼 | 容量：${item.capacity}人 | 入住：${item.residents}人 | ${gender}宿舍`,
          type: 'dormitory',
          source: '宿舍信息',
          date: '',
          relevance: this.calculateRelevance(query, item.building + ' ' + item.room)
        });
      }
    });
    
    // 按相关度排序
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
  },

  /**
   * 计算相关度
   */
  calculateRelevance(query, text) {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();
    
    // 完整匹配加分
    if (lowerText.includes(lowerQuery)) {
      score += 10;
    }
    
    // 字符匹配
    for (const char of lowerQuery) {
      if (lowerText.includes(char)) {
        score += 1;
      }
    }
    
    return score;
  },

  /**
   * 调用DeepSeek API（带搜索上下文）
   */
  async callDeepSeekWithContext(question, searchResults) {
    // 构建上下文
    let context = '';
    let systemPrompt = '';
    
    if (searchResults.length > 0) {
      context = '以下是校园数据库中与您问题相关的信息（仅供参考）：\n\n';
      searchResults.slice(0, 5).forEach((item, index) => {
        context += `${index + 1}. [${item.source}] ${item.title}\n   ${item.summary}\n\n`;
      });
      context += '\n';
      systemPrompt = '你是一位聪明、友好的全能AI助手。你可以回答任何问题，包括学术、技术、生活、娱乐等各个领域。\n\n' +
                   '如果提供了校园数据库信息，请优先参考这些信息回答校园相关问题。\n' +
                   '但你也可以自由使用你自己的知识来回答任何问题。\n' +
                   '请用自然、友好的语气回答，保持回答简洁明了。';
    } else {
      systemPrompt = '你是一位聪明、友好的全能AI助手。你可以回答任何问题，包括学术、技术、生活、娱乐、编程、数学等各个领域。\n\n' +
                   '请用自然、友好的语气回答，保持回答简洁明了。';
    }

    const response = await axios.post(
      config.deepseekApiUrl,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `${context}用户问题：${question}`
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.deepseekApiKey}`
        },
        timeout: 15000
      }
    );

    return response.data.choices[0]?.message?.content || this.generateAnswerFromData(question, searchResults);
  },

  /**
   * 从本地数据生成回答（API不可用时的后备）
   */
  generateAnswerFromData(question, searchResults) {
    const q = question.toLowerCase();
    
    // 文案生成请求优先处理（即使有搜索结果也应该生成文案）
    if (q.includes('生成') || q.includes('写') || q.includes('创作') || q.includes('文案')) {
      return this.generateTextContent(question);
    }
    
    // 如果搜索结果为空，尝试使用通用知识库回答
    if (searchResults.length === 0) {
      const generalAnswer = this.getGeneralKnowledgeAnswer(question);
      if (generalAnswer) {
        return generalAnswer;
      }
      return `抱歉，没有在校园数据库中找到与"${question}"相关的信息。您可以尝试：\n1. 换个关键词搜索\n2. 查看通知公告获取最新信息\n3. 联系相关部门咨询`;
    }
    
    const topResults = searchResults.slice(0, 3);
    let answer = `根据校园数据库查询到以下相关信息：\n\n`;
    
    topResults.forEach((item, index) => {
      answer += `${index + 1}. 【${item.source}】${item.title}\n   ${item.summary}\n\n`;
    });
    
    if (searchResults.length > 3) {
      answer += `还有 ${searchResults.length - 3} 条相关结果，请查看下方搜索结果列表。`;
    }
    
    return answer;
  },
  
  /**
   * 通用知识库回答（当数据库无匹配时使用）
   */
  getGeneralKnowledgeAnswer(question) {
    const q = question.toLowerCase();
    
    // 文案生成相关（必须放在最前面，避免被其他分类拦截）
    if (q.includes('生成') || q.includes('写') || q.includes('创作') || q.includes('文案')) {
      return this.generateTextContent(question);
    }
    
    // 图书馆相关
    if (q.includes('图书馆') || q.includes('借书') || q.includes('还书') || q.includes('借阅')) {
      return `📚 图书馆常见问题解答：\n\n• 开放时间：周一至周五 8:00-22:00，周末 9:00-21:00\n• 借阅规则：每人最多借阅10本，借期30天\n• 续借方式：可在图书馆网站或APP上续借1次\n• 超期罚款：每天0.1元/本\n\n如需具体书籍位置，请搜索书名！`;
    }
    
    // 选课相关
    if (q.includes('选课') || q.includes('学分') || q.includes('课程')) {
      return `🎓 选课相关信息：\n\n• 选课时间：每学期开学前两周\n• 学分限制：每学期最多选修25学分\n• 查看课表：登录教务系统查看\n• 退课时间：选课结束后一周内可退课\n\n如有具体选课通知，请搜索"选课"查看详情！`;
    }
    
    // 成绩相关
    if (q.includes('成绩') || q.includes('绩点') || q.includes('gpa')) {
      return `📊 成绩查询指南：\n\n• 查询方式：登录教务系统→成绩查询\n• 绩点计算：(∑课程成绩×学分数)÷总学分\n• 成绩复核：公布后3个工作日内申请\n• 奖学金：每学期末评定\n\n如有具体成绩通知，请搜索"成绩"查看！`;
    }
    
    // 校园卡相关
    if (q.includes('校园卡') || q.includes('充值') || q.includes('挂失')) {
      return `💳 校园卡服务：\n\n• 充值方式：食堂充值机、APP充值、微信充值\n• 挂失补卡：携带身份证到一卡通中心办理\n• 消费查询：校园卡APP或自助查询机\n• 密码修改：一卡通中心或APP修改\n\n如有系统升级通知，请搜索"校园卡"查看！`;
    }
    
    // 宿舍相关
    if (q.includes('宿舍') || q.includes('门禁') || q.includes('热水')) {
      return `🏠 宿舍生活指南：\n\n• 门禁时间：周日至周四 23:00，周五周六 23:30\n• 热水供应：6:00-8:00, 12:00-14:00, 18:00-22:00\n• 维修报修：登录后勤服务系统提交\n• 宿舍管理：学生公寓管理中心\n\n如需具体宿舍信息，请搜索楼号！`;
    }
    
    // 食堂相关
    if (q.includes('食堂') || q.includes('吃饭') || q.includes('餐饮')) {
      return `🍜 食堂信息：\n\n• 第一食堂：6:30-20:00\n• 第二食堂：6:00-21:00\n• 第三食堂：7:00-19:00\n• 支付方式：校园卡、微信、支付宝\n\n如需具体菜品，请搜索菜名或食堂名称！`;
    }
    
    // 考试相关
    if (q.includes('考试') || q.includes('期末') || q.includes('考场')) {
      return `✏️ 考试相关：\n\n• 考试安排：教务处网站查询\n• 考场规则：携带学生证和身份证\n• 违纪处理：严格按照校规处理\n• 缓考申请：提前向学院申请\n\n如有具体考试安排，请搜索"考试"查看！`;
    }
    
    // 活动相关
    if (q.includes('活动') || q.includes('报名') || q.includes('比赛')) {
      return `🎉 校园活动：\n\n• 活动发布：校园官网、学生会公众号\n• 报名方式：线上报名或现场报名\n• 活动类型：学术、文体、志愿等\n\n如需具体活动信息，请搜索活动名称！`;
    }
    
    // 就业相关
    if (q.includes('就业') || q.includes('实习') || q.includes('招聘')) {
      return `💼 就业指导：\n\n• 双选会：每年春秋两季举办\n• 就业指导中心：提供简历指导、面试培训\n• 实习机会：就业信息网发布\n• 档案管理：毕业后按规定转递\n\n如有招聘会信息，请搜索"就业"查看！`;
    }
    
    // 失物招领相关（事实性查询）
    if (q.includes('丢失') || q.includes('拾到') || q.includes('失物') || q.includes('招领')) {
      return `🔍 失物招领：\n\n• 失物登记：到各楼服务台登记\n• 招领查询：查看失物招领公告或搜索相关信息\n• 联系电话：各服务台公示\n\n如需具体信息，请搜索"失物"或物品名称！\n\n如需生成失物招领文案，请说"帮我生成失物招领文案"！`;
    }
    
    return null;
  },
  
  /**
   * 文本内容生成（文案创作）
   */
  generateTextContent(question) {
    const q = question.toLowerCase();
    
    // 失物招领文案生成
    if (q.includes('失物招领') || q.includes('寻物启事') || q.includes('丢东西')) {
      return `📝 失物招领文案模板：\n\n【失物招领/寻物启事】\n\n各位同学：\n\n本人于${new Date().toLocaleDateString()}在【具体地点】不慎${q.includes('丢') || q.includes('丢失') ? '遗失' : '拾到'}【物品名称】，${q.includes('丢') || q.includes('丢失') ? '如有拾到者请与我联系，必有重谢！' : '请失主看到后与我联系认领。'}\n\n物品描述：【物品特征描述】\n\n联系方式：【姓名】 ${q.includes('丢') || q.includes('丢失') ? '手机：XXX-XXXXXXX' : '手机：XXX-XXXXXXX / 放置地点：XXX服务台'}\n\n${new Date().toLocaleDateString()}\n\n---\n如需我帮您定制具体文案，请告诉我：物品名称、丢失/拾到地点、物品特征、联系方式！`;
    }
    
    // 请假条生成
    if (q.includes('请假') || q.includes('请假条')) {
      return `📝 请假条模板：\n\n请假条\n\n尊敬的【老师/领导】：\n\n您好！我是【姓名】，【班级/部门】学生/员工，学号/工号：【XXX】。\n\n因【请假原因】，需请假【X】天，时间从【开始日期】至【结束日期】。\n\n请假期间，我会安排好学习/工作，请批准！\n\n此致\n敬礼！\n\n申请人：【姓名】\n日期：${new Date().toLocaleDateString()}\n联系电话：【XXX-XXXXXXX】`;
    }
    
    // 感谢信生成
    if (q.includes('感谢') || q.includes('感谢信')) {
      return `📝 感谢信模板：\n\n感谢信\n\n尊敬的【对象】：\n\n衷心感谢您在【具体事件】中给予我的帮助与支持！\n\n【具体描述感谢的事情和对方的帮助】\n\n您的善举让我感受到了温暖，再次向您表示诚挚的感谢！\n\n此致\n敬礼！\n\n【姓名】\n${new Date().toLocaleDateString()}`;
    }
    
    // 通知公告生成
    if (q.includes('通知') || q.includes('公告')) {
      return `📝 通知公告模板：\n\n【通知标题】\n\n各位【同学/教职工】：\n\n【通知内容：说明事项、时间、地点、要求等】\n\n【注意事项】\n\n请大家相互转告，积极配合！\n\n【发布单位】\n${new Date().toLocaleDateString()}`;
    }
    
    // 申请书生成
    if (q.includes('申请') || q.includes('申请书')) {
      return `📝 申请书模板：\n\n申请书\n\n尊敬的【审批部门/领导】：\n\n您好！我是【姓名】，【班级/部门】学生/员工。\n\n现因【申请原因】，特向您申请【申请事项】。\n\n【具体说明申请的理由和相关情况】\n\n希望得到您的批准！\n\n此致\n敬礼！\n\n申请人：【姓名】\n日期：${new Date().toLocaleDateString()}\n联系电话：【XXX-XXXXXXX】`;
    }
    
    // 通用文案生成
    return `✨ 文案生成助手：\n\n我可以帮您生成各种类型的文案！请告诉我您需要什么类型的文案，例如：\n• 失物招领/寻物启事\n• 请假条\n• 感谢信\n• 通知公告\n• 申请书\n• 活动策划书\n• 演讲稿\n\n请提供更多细节，我来帮您定制！`;
  },

  /**
   * 问题分类
   */
  categorizeQuestion(question) {
    const categories = {
      'academic': ['选课', '成绩', '考试', '学分', '毕业', '论文', '奖学金'],
      'library': ['图书', '借书', '图书馆', '书籍'],
      'activity': ['活动', '比赛', '演出', '讲座', '报名'],
      'life': ['宿舍', '食堂', '餐饮', '生活'],
      'lost': ['丢失', '拾到', '失物', '招领'],
      'card': ['校园卡', '充值', '消费'],
      'repair': ['报修', '维修', '故障']
    };
    
    for (const [cat, keywords] of Object.entries(categories)) {
      if (keywords.some(kw => question.includes(kw))) {
        return cat;
      }
    }
    return 'other';
  },

  /**
   * 执行搜索
   */
  async performSearch(query) {
    // 直接从本地数据库搜索
    return this.searchAllTables(query);
  },

  /**
   * 获取演示回答（保留向后兼容）
   */
  getDemoAnswer(question) {
    const searchResults = this.searchAllTables(question);
    return this.generateAnswerFromData(question, searchResults);
  },

  /**
   * 获取演示搜索结果（保留向后兼容）
   */
  getDemoSearchResults(query) {
    return this.searchAllTables(query);
  }
};

module.exports = AIService;
